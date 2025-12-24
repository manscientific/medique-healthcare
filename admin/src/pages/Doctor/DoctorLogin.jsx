import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from '../../../../frontend/src/assets/assets';

function DoctorLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const doctor = location.state?.doctor;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple password check (replace with backend validation)
    setTimeout(() => {
      if (password === "doctor123") {
        navigate("/verify", { state: { doctor } });
      } else {
        setError("❌ Invalid password. Access denied.");
      }
      setLoading(false);
    }, 1000);
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Access Denied</h1>
          <p className="text-xl text-gray-700">No doctor information provided.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img className="mx-auto w-32" src={assets.new_logo} alt="MediQ" />
          <h2 className="mt-6 text-4xl font-black text-gray-900">
            Doctor Login
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Access Verification Panel for
          </p>
          <div className="mt-4 bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/20">
            <div className="flex items-center gap-4">
              <img 
                className="w-16 h-16 rounded-full object-cover border-2 border-primary" 
                src={doctor.image} 
                alt={doctor.name}
              />
              <div className="text-left">
                <h3 className="text-2xl font-black text-gray-900">Dr. {doctor.name}</h3>
                <p className="text-lg text-primary font-semibold">{doctor.speciality}</p>
              </div>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full px-4 py-4 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
              placeholder="Enter doctor password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-lg font-semibold text-center">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                "🔐 Login to Panel"
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-lg text-primary hover:text-blue-700 font-semibold"
            >
              ← Back to Home
            </button>
          </div>
        </form>

        <div className="text-center text-gray-500 text-lg">
          <p>For authorized medical personnel only</p>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;