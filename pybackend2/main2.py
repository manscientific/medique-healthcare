import base64
import datetime
import os
import numpy as np
import cv2
import smtplib

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

from insightface.app import FaceAnalysis

# =====================================================
# LOAD ENV VARIABLES
# =====================================================
load_dotenv()

# =====================================================
# CONFIG (FROM ENV)
# =====================================================
MONGO_URI = os.getenv("PYTHON_MONGO_URI")
DB_NAME = os.getenv("PYTHON_DB_NAME")

if not MONGO_URI or not DB_NAME:
    raise RuntimeError("PYTHON_MONGO_URI and PYTHON_DB_NAME must be set")

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

FACE_THRESHOLD = float(os.getenv("FACE_THRESHOLD", 0.8))

# =====================================================
# APP
# =====================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# DATABASE
# =====================================================
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()
except Exception as e:
    raise RuntimeError(f"MongoDB connection failed: {e}")

db = client[DB_NAME]
users = db.users
doctors = db.doctors

# =====================================================
# LOAD INSIGHTFACE MODEL (LOCAL)
# =====================================================
face_app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)
face_app.prepare(ctx_id=0, det_size=(640, 640))

# =====================================================
# HELPERS
# =====================================================
def decode_image(b64: str):
    try:
        data = base64.b64decode(b64.split(",")[-1])
        arr = np.frombuffer(data, np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)
    except Exception:
        return None


def get_face_embedding(frame):
    if frame is None:
        return None

    faces = face_app.get(frame)
    if not faces:
        return None

    return faces[0].embedding.tolist()


def send_email(to, subject, body):
    if not EMAIL_USERNAME or not EMAIL_PASSWORD:
        print("Email credentials not set")
        return

    msg = MIMEMultipart()
    msg["From"] = EMAIL_USERNAME
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as s:
            s.starttls()
            s.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            s.send_message(msg)
    except Exception as e:
        print("Email error:", e)


def get_or_create_doctor(name: str):
    name = name.strip()
    doc = doctors.find_one({"name": name})

    if not doc:
        doctors.insert_one({
            "name": name,
            "waiting": 0,
            "verified": 0
        })
        doc = doctors.find_one({"name": name})

    return doc

# =====================================================
# ROUTES
# =====================================================
@app.get("/count/{doctor_name}")
def get_count(doctor_name: str):
    doc = doctors.find_one({"name": doctor_name.strip()})
    return {"waiting_count": doc.get("waiting", 0) if doc else 0}


@app.post("/register")
async def register(request: Request):
    data = await request.json()

    doctor = get_or_create_doctor(data["doctorName"])
    frame = decode_image(data["image"])
    embedding = get_face_embedding(frame)

    if embedding is None:
        return {"status": "error", "message": "Face not detected"}

    users.insert_one({
        "doctorId": doctor["_id"],
        "embedding": embedding,
        "email": data["email"],
        "status": "waiting",
        "timestamp": datetime.datetime.utcnow()
    })

    doctors.update_one(
        {"_id": doctor["_id"]},
        {"$inc": {"waiting": 1}}
    )

    return {
        "status": "success",
        "doctorName": doctor["name"],
        "message": "Face registered successfully"
    }


@app.post("/verify")
async def verify(request: Request):
    data = await request.json()

    doctor = doctors.find_one({"name": data["doctorName"].strip()})
    if not doctor:
        return {"status": "error", "message": "Doctor not found"}

    frame = decode_image(data["image"])
    embedding = get_face_embedding(frame)

    if embedding is None:
        return {"status": "error", "message": "Face not detected"}

    emb = np.array(embedding)

    for user in users.find({"doctorId": doctor["_id"], "status": "waiting"}):
        stored = np.array(user["embedding"])

        score = np.dot(emb, stored) / (
            np.linalg.norm(emb) * np.linalg.norm(stored)
        )

        if score >= FACE_THRESHOLD:
            users.delete_one({"_id": user["_id"]})

            doctors.update_one(
                {"_id": doctor["_id"]},
                {"$inc": {"waiting": -1, "verified": 1}}
            )

            send_email(
                user["email"],
                "Your turn",
                "Please come in, the doctor is ready."
            )

            return {
                "status": "success",
                "similarity": float(score)
            }

    return {"status": "error", "message": "No matching face found"}
