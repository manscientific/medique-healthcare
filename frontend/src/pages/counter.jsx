import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

//const API_BASE = "http://localhost:8000";
const API_BASE = import.meta.env.VITE_API_BASE;


function Counter() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.doctor) {
      setSelectedDoctor(location.state.doctor);
    }
  }, [location.state]);

  const fetchCount = async () => {
    if (!selectedDoctor) return;
    try {
      const res = await axios.get(`${API_BASE}/count/${selectedDoctor.name}`);
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
  }, [selectedDoctor]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>🏥 Digital Waiting Room</h1>
          <div style={styles.divider}></div>
        </header>

        {selectedDoctor && (
          <div style={styles.doctorSection}>
            <h2 style={styles.doctorTitle}>Current Doctor</h2>
            <div style={styles.doctorBadge}>
              <span style={styles.doctorName}>Dr. {selectedDoctor.name}</span>
            </div>
          </div>
        )}

        <div style={styles.counterSection}>
          <div style={styles.counterContainer}>
            <h3 style={styles.counterLabel}>Patients Waiting</h3>
            <div style={styles.counterDisplay}>
              <span style={styles.counterNumber}>{count}</span>
            </div>
            <p style={styles.counterSubtext}>Real-time updates every 2 seconds</p>
          </div>
        </div>

        <div style={styles.actionsSection}>
          <button
            onClick={() => navigate("/register", { state: { doctor: selectedDoctor } })}
            style={styles.primaryButton}
          >
            📝 Patient Registration
          </button>

          {/* <button
            onClick={() => navigate("/doctor-login", { state: { doctor: selectedDoctor } })}
            style={styles.secondaryButton}
          >
            🔒 Doctor Verification
          </button> */}
        </div>

        {message && (
          <div style={styles.messageContainer}>
            <p style={styles.messageText}>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center"
  },
  header: {
    marginBottom: "30px"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2d3748",
    margin: "0 0 15px 0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  divider: {
    height: "4px",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "2px",
    width: "80px",
    margin: "0 auto"
  },
  doctorSection: {
    marginBottom: "30px",
    padding: "20px",
    background: "#f7fafc",
    borderRadius: "12px",
    border: "2px solid #e2e8f0"
  },
  doctorTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#4a5568",
    margin: "0 0 10px 0"
  },
  doctorBadge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "25px",
    fontSize: "1.4rem",
    fontWeight: "600"
  },
  doctorName: {
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
  },
  counterSection: {
    marginBottom: "40px"
  },
  counterContainer: {
    background: "linear-gradient(135deg, #fed7e2 0%, #fbb6ce 100%)",
    padding: "30px",
    borderRadius: "15px",
    border: "3px solid #f687b3"
  },
  counterLabel: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#702459",
    margin: "0 0 15px 0"
  },
  counterDisplay: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    margin: "15px 0",
    border: "2px solid #f687b3"
  },
  counterNumber: {
    fontSize: "4rem",
    fontWeight: "800",
    color: "#702459",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)"
  },
  counterSubtext: {
    fontSize: "0.9rem",
    color: "#702459",
    opacity: "0.8",
    margin: "10px 0 0 0",
    fontStyle: "italic"
  },
  actionsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px"
  },
  primaryButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "18px 30px",
    fontSize: "1.2rem",
    fontWeight: "600",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
  },
  secondaryButton: {
    background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
    color: "white",
    border: "none",
    padding: "18px 30px",
    fontSize: "1.2rem",
    fontWeight: "600",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(245, 101, 101, 0.3)"
  },
  messageContainer: {
    marginTop: "20px",
    padding: "15px",
    background: "#fed7d7",
    borderRadius: "8px",
    border: "1px solid #feb2b2"
  },
  messageText: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#c53030",
    margin: "0"
  }
};

// Add hover effects
const addHoverEffects = () => {
  const primaryButton = document.querySelector(`button[style*="${styles.primaryButton.background}"]`);
  const secondaryButton = document.querySelector(`button[style*="${styles.secondaryButton.background}"]`);
  
  if (primaryButton) {
    primaryButton.onmouseenter = () => {
      primaryButton.style.transform = "translateY(-2px)";
      primaryButton.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)";
    };
    primaryButton.onmouseleave = () => {
      primaryButton.style.transform = "translateY(0)";
      primaryButton.style.boxShadow = styles.primaryButton.boxShadow;
    };
  }
  
  if (secondaryButton) {
    secondaryButton.onmouseenter = () => {
      secondaryButton.style.transform = "translateY(-2px)";
      secondaryButton.style.boxShadow = "0 8px 25px rgba(245, 101, 101, 0.4)";
    };
    secondaryButton.onmouseleave = () => {
      secondaryButton.style.transform = "translateY(0)";
      secondaryButton.style.boxShadow = styles.secondaryButton.boxShadow;
    };
  }
};

// Call hover effects after component mounts
setTimeout(addHoverEffects, 100);

export default Counter;