import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";

//const API_BASE = "http://localhost:8000";
const API_BASE = import.meta.env.VITE_API_BASE;


function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(""); // NEW: Email state
  const webcamRef = useRef(null);

  useEffect(() => {
    if (location.state?.doctor) setDoctor(location.state.doctor);
  }, [location.state]);

  const fetchCount = async () => {
    if (!doctor) return;
    try {
      const res = await axios.get(`${API_BASE}/count/${doctor.name}`);
      setCount(res.data.waiting_count);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching count");
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 2000);
    return () => clearInterval(interval);
  }, [doctor]);

  const captureImage = () => {
    if (!webcamRef.current) return null;
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  };

  const registerUser = async () => {
    if (!doctor) return;
    
    // NEW: Validate email
    if (!email || !email.includes('@')) {
      setMessage("❌ Please enter a valid email address");
      return;
    }

    const image = captureImage();
    if (!image) {
      setMessage("❌ Could not capture image");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE}/register/`, {
        doctorName: doctor.name,
        image: image,
        email: email, // NEW: Include email in request
      });

      if (res.data.status === "success") {
        setMessage(
          `✅ Registered with Dr. ${res.data.doctorName} • Your waiting position: ${res.data.waiting_count}`
        );
        setEmail(""); // Clear email after successful registration
        fetchCount();
      } else {
        setMessage(`❌ ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Patient{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Registration
            </span>
          </h1>
          <p className="text-2xl text-gray-700">
            Register using face recognition
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden p-8">
          {/* Doctor Info */}
          {doctor && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-700">
                Dr. {doctor.name}
              </h2>
            </div>
          )}

          {/* NEW: Email Input */}
          <div className="mb-8">
            <label className="block text-xl font-semibold text-gray-700 mb-3 text-center">
              📧 Enter Your Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full max-w-md mx-auto block p-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Camera Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="webcam-container mb-6">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
                className="rounded-2xl border-4 border-blue-300 shadow-lg"
              />
            </div>

            <button
              onClick={registerUser}
              disabled={isLoading || !doctor || !email}
              className={`py-4 px-10 rounded-2xl text-2xl font-black transition-all ${
                isLoading || !doctor || !email
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-blue-600 text-white hover:scale-105"
              }`}
            >
              {isLoading ? "Processing..." : "📸 Register with Face Recognition"}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`p-6 text-center rounded-2xl text-xl font-bold mb-6 ${
                message.includes("❌")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Queue Info */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-around text-center gap-6">
            <div className="bg-blue-100 px-10 py-6 rounded-3xl shadow-md border-2 border-blue-300">
              <p className="text-4xl font-black text-blue-700">{count}</p>
              <p className="text-lg font-semibold text-blue-600 mt-2">
                Waiting Patients
              </p>
            </div>
          </div>

          {/* Navigation Button */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate("/")}
              className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;