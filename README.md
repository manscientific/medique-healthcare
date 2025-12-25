# 🏥 Medique — Smart Patient Queue & Waiting Time Management System

**Revolutionizing healthcare waiting experiences through intelligent digital queuing.**

**"wait without waiting"**

Medique is an innovative multi-service healthcare platform designed to **significantly reduce patient waiting times** at clinics and hospitals. By digitizing traditional queues and enabling patients to wait remotely from home, Medique enhances patient comfort, reduces clinic overcrowding, and optimizes healthcare operational efficiency.

---

# 🚀 Why Medique Is Truly Unique

## 🕒 The Problem

In most clinics and government hospitals, patients are forced to wait for hours in crowded, chaotic waiting rooms.  
There is:

- **No real-time visibility** of the queue
- **No control** over waiting time
- **High risk** of infection
- **Huge wastage** of time for patients and attendants

Appointments exist, but waiting is still offline and unmanaged.

---

## 🌐 Medique's Solution: Remote Waiting System

Medique completely eliminates physical waiting by converting it into a remote, digital process.

**Instead of sitting in the clinic:**
- Patients join the queue **from home**
- They track their position **live**
- They arrive at the clinic **only when needed**

**Waiting no longer means being present physically.**

---

## 🏥 Digital Waiting Room (Core Innovation)

Each doctor gets a **Digital Waiting Room** that updates automatically in real time.

### How it works:

1. **Patient Registration**
   - Patient registers using their phone (face scan or secure digital check-in)
   - The system increments the waiting count (+1) for that doctor

2. **Live Queue Visibility**
   - Patients see:
     - Current waiting count
     - Estimated waiting time
     - Their position in the queue
   - This works **remotely, from anywhere**

3. **Doctor Entry Confirmation**
   - Just before meeting the doctor, the patient goes through a final verification
   - The system decrements the waiting count (-1)
   - Queue updates instantly for everyone

**The entire waiting process is automatic, transparent, and real-time.**

---

## 🔑 What Makes Medique Different from Everything Else

### ❌ **What we eliminate:**
- No manual tokens
- No verbal calling of patients
- No overcrowded waiting rooms
- No uncertainty

### ✅ **What we provide:**
- Fully automated queue management
- Remote waiting from home
- Real-time digital updates
- Reduced infection risk
- Massive time savings for patients
- Organized workflow for doctors

**Medique doesn't just optimize waiting — it redefines how waiting should exist in healthcare.**

---

## 🎯 The Bigger Vision

Medique turns clinics into:
- **Predictable systems**
- **Digitally managed spaces**
- **Patient-first environments**

**Our goal is simple:**  
Patients should wait in comfort, not in chaos.

**Deployments:**

patient portal: https://medique-eta.vercel.app/

admin and doctor portal: https://mediq-admin.vercel.app/

***NOTE***
   WE HAVE DEPLOYED OUR BACKEND ON RENDER UNDER FREE TIER AND RENDER SLEEPS AFTER 15 MINUTES OF INACTIVITY . A COLD START NEEDS 2-3 MINUTES TO ANSWER THE REUQESTS SO PLEASE WAIT IF IT LAGS .
## ✨ Key Features

| Feature | Description |
|---------|-------------|
| ⏱️ **Digital Queuing** | Real-time patient queue management per doctor |
| 🏠 **Remote Waiting** | Patients wait from home—no more crowded waiting rooms |
| 🤖 **AI-Powered Predictions(in future)** | Waiting time forecasting using crowd data, consultation history, and traffic |
| 🧠 **Face Recognition** | Optional secure patient verification via face recognition (hardware/mobile) |
| 🔐 **Secure Authentication** | JWT-based secure access for patients and staff |
| 🌐 **Multi-Service Architecture** | Separate backends for API, AI logic, and ML services |
| 🐳 **Full Containerization** | Dockerized setup—run everything with one command |

---

## 🛠️ Tech Stack

### **Frontend**
- React (Vite) – Patient & Admin portals

### **Backend Services**
- **Main API**: Node.js + Express (RESTful endpoints, authentication)
- **AI/Queue Logic**: Python + FastAPI (real-time queue management & predictions)
- **ML Service**: Python (face recognition & waiting time prediction models)

### **Database**
- MongoDB (NoSQL for flexible healthcare data storage)

### **DevOps & Deployment**
- Docker + Docker Compose (container orchestration)
- Environment-based configuration

  
---

## 📁 Project Structure

```
medique/
├── frontend/                 # Patient-facing React application
├── admin/                    # Admin dashboard React application
├── backend/                  # Node.js + Express main API
├── pybackend2/                # Python + FastAPI queue & AI service
├── docker-compose.yml        # Multi-container orchestration
├── .env.example              # Environment variables template
├── README.md                 # Project documentation
└── .gitignore                # Git exclusion rules
```

---

## 🚀 Getting Started

### ✅ **Prerequisites**
You only need **two tools** installed locally:
1. **Docker**
2. **Docker Compose**
3. Cloudinary Account (for image assets)
4. Stripe/Razorpay API Keys (not compulsory but if u want payements to work)


**No need to install:** Node.js, Python, MongoDB, or any other dependencies—they are all containerized.

#### **Verify Installation**
```bash
docker --version
docker compose version
```

### 🐳 **Run the Entire System with One Command**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medique
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (if needed)
   ```

3. **Build and launch all services**
   ```bash
   docker compose up --build
   ```

4. **Access the applications**
   - **Patient Portal**: http://localhost:5173
   - **Admin Dashboard**: http://localhost:5174
   - **API Documentation**: http://localhost:8000/docs (FastAPI)
   - **Main API**: http://localhost:5000/api

---

## 🔧 Development & Customization

### **Service Ports**
| Service | Port | Description |
|---------|------|-------------|
| Frontend | 5173 | Patient application |
| Admin(admin+doctor login) | 5174 | Administrative interface |
| Node API | 5000 | Primary REST API |
| FastAPI | 8000 | AI & queue management API |
| MongoDB | 27017 | Database |
|

### **Running Specific Services**
```bash
# Start only database and main API
docker compose up mongodb backend

# Rebuild a specific service
docker compose up --build frontend
```

### **View Logs**
```bash
# All services logs
docker compose logs

# Specific service logs
docker compose logs backend

# Follow logs in real-time
docker compose logs -f frontend
```

### **Stop All Services**
```bash
docker compose down

# Remove volumes (cleans database)
docker compose down -v
```

---

## 🔐 Environment Configuration

Copy `.env.example` to `.env` and customize:

```env

# ==================================
# GLOBAL
# ==================================
NODE_ENV=production
CURRENCY=INR
JWT_SECRET=your_jwt_secret_here

# ==================================
# DATABASES (SEPARATE)
# ==================================

# Node backend DB
MONGO_URI=mongodb://mongo:27017/prescripto

# Python backend DB
PYTHON_MONGO_URI=mongodb://mongo:27017/waiting_room
PYTHON_DB_NAME=waiting_room



# ==================================
# EMAIL (SMTP)
# ==================================
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# ==================================
# FACE RECOGNITION
# ==================================
FACE_THRESHOLD=0.75

# ==================================
# ADMIN PANEL
# ==================================
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password_here

# ==================================
# CLOUDINARY
# ==================================
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# ==================================
# PAYMENTS
# ==================================
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

# ==================================
# PORTS
# ==================================
NODE_PORT=4000
PYTHON_PORT=8000

# ==================================
# FRONTEND (VITE)
# ==================================
VITE_CURRENCY=₹
VITE_BACKEND_URL=http://localhost:4000
VITE_API_BASE=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

```

---


---


---

## 🙏 Acknowledgments

- Healthcare professionals for insights into patient flow management
- Open-source communities like greatstack for the amazing tools
- Contributors who help improve Medique

---

**Made with ❤️ for better healthcare experiences**
