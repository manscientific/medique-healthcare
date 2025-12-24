import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";

//const API_BASE = "http://localhost:8000";
const API_BASE = import.meta.env.VITE_API_BASE;

function Verify() {
  const navigate = useNavigate();
  const { doctorData } = useContext(DoctorContext);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!doctorData?.name) {
      navigate("/doctor-login");
    }
  }, [doctorData, navigate]);

  // Start webcam on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: "user" 
          } 
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setCameraError(false);
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraError(true);
        setMessage("⚠️ Please allow camera access to verify patients.");
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Fetch waiting count
  const fetchCount = async () => {
    if (!doctorData?.name) return;
    try {
      const res = await axios.get(`${API_BASE}/count/${doctorData.name}`);
      if (res.data.waiting_count !== undefined) {
        setCount(res.data.waiting_count);
      } else {
        setMessage("❌ Doctor not found. Please log in again.");
      }
    } catch (err) {
      console.error("Error fetching count:", err);
      setMessage("❌ Error fetching patient count");
    }
  };

  // Auto-refresh every 3s
  useEffect(() => {
    if (doctorData?.name) {
      fetchCount();
      const interval = setInterval(fetchCount, 3000);
      return () => clearInterval(interval);
    }
  }, [doctorData]);

  // Capture webcam frame with better quality
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || video.videoWidth === 0) {
      console.error("Video not ready or no video stream");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to JPEG with good quality
    return canvas.toDataURL("image/jpeg", 0.8);
  };

  // Verify next patient using face recognition
  const verifyUser = async () => {
    if (!doctorData?.name) {
      setMessage("❌ Please log in first");
      return;
    }

    if (cameraError) {
      setMessage("❌ Camera is not accessible. Please refresh and allow camera access.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    // Add small delay to ensure camera is ready
    await new Promise(resolve => setTimeout(resolve, 500));

    const imageData = captureFrame();
    if (!imageData) {
      setMessage("⚠️ Unable to capture image. Please ensure camera is working.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending verification request...");
      const res = await axios.post(`${API_BASE}/verify/`, {
        doctorName: doctorData.name,
        image: imageData,
      });

      console.log("Verification response:", res.data);

      if (res.data.status === "success") {
        const newMessage = `✅ ${res.data.message} Remaining patients: ${res.data.waiting_count}`;
        setMessage(newMessage);
        setCount(res.data.waiting_count);

        setVerificationHistory((prev) => [
          {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            message: newMessage,
            status: "success",
          },
          ...prev.slice(0, 9), // Keep last 10 items
        ]);
      } else {
        const errMsg = `❌ ${res.data.message}`;
        setMessage(errMsg);
        
        setVerificationHistory((prev) => [
          {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            message: errMsg,
            status: "error",
          },
          ...prev.slice(0, 9),
        ]);
      }

    } catch (err) {
      console.error("Verification error:", err);
      let errorMessage = "❌ Verification failed. ";
      
      if (err.response) {
        errorMessage += err.response.data.message || "Server error";
      } else if (err.request) {
        errorMessage += "Cannot connect to server. Please check if backend is running.";
      } else {
        errorMessage += "Network error. Please try again.";
      }

      setMessage(errorMessage);
      setVerificationHistory((prev) => [
        {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          message: errorMessage,
          status: "error",
        },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setVerificationHistory([]);
    setMessage("");
  };

  const retryCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: "user" 
        } 
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraError(false);
      setMessage("✅ Camera connected successfully");
    } catch (err) {
      setCameraError(true);
      setMessage("❌ Failed to access camera. Please check permissions.");
    }
  };

  if (!doctorData?.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-black text-gray-700">
            Redirecting to Doctor Login...
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Please wait while we redirect you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Doctor{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Verification Panel
            </span>
          </h1>
          <p className="text-2xl text-gray-700">
            Verify patients using real-time face recognition
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Welcome, Dr. {doctorData.name}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden p-8">
          {/* Camera Section */}
          <div className="flex flex-col items-center mb-8">
            {cameraError ? (
              <div className="w-80 h-64 rounded-2xl border-4 border-red-300 shadow-lg mb-6 flex items-center justify-center bg-red-50">
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-red-600 font-semibold">Camera Error</p>
                  <button
                    onClick={retryCamera}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Retry Camera
                  </button>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-80 h-64 rounded-2xl border-4 border-blue-300 shadow-lg mb-6 object-cover"
              ></video>
            )}

            <button
              onClick={verifyUser}
              disabled={isLoading || cameraError}
              className={`py-4 px-10 rounded-2xl text-2xl font-black transition-all transform ${
                isLoading || cameraError
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Verifying...
                </span>
              ) : (
                "🔍 Verify Patient"
              )}
            </button>

            {cameraError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Camera access is required for verification
              </p>
            )}
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`p-6 text-center rounded-2xl text-xl font-bold mb-6 ${
                message.includes("❌") || message.includes("Error")
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-green-100 text-green-700 border border-green-200"
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

            <div className="bg-green-100 px-10 py-6 rounded-3xl shadow-md border-2 border-green-300">
              <p className="text-4xl font-black text-green-700">
                {
                  verificationHistory.filter((v) => v.status === "success")
                    .length
                }
              </p>
              <p className="text-lg font-semibold text-green-600 mt-2">
                Verified Today
              </p>
            </div>
          </div>

          {/* History */}
          {verificationHistory.length > 0 && (
            <div className="mt-10 bg-gray-50 p-6 rounded-3xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-gray-800">
                  📋 Verification History
                </h3>
                <button
                  onClick={clearHistory}
                  className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 font-semibold transition-colors"
                >
                  🗑️ Clear
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {verificationHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border ${
                      item.status === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.message}</span>
                      <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Verify;