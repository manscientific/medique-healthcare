import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );

  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // ✅ Add doctorData to share profile info across components (dashboard, verify, etc.)
  const [doctorData, setDoctorData] = useState(
    localStorage.getItem("doctorData")
      ? JSON.parse(localStorage.getItem("doctorData"))
      : null
  );

  // 🔄 Sync doctorData with localStorage
  useEffect(() => {
    if (doctorData) {
      localStorage.setItem("doctorData", JSON.stringify(doctorData));
    } else {
      localStorage.removeItem("doctorData");
    }
  }, [doctorData]);

  // ✅ Save or remove token when it changes
  useEffect(() => {
    if (dToken) localStorage.setItem("dToken", dToken);
    else localStorage.removeItem("dToken");
  }, [dToken]);

  // 🩺 Get Doctor Appointments
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        { headers: { dToken } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching appointments");
    }
  };

  // 👤 Get Doctor Profile
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { dToken },
      });

      if (data.success) {
        setProfileData(data.profileData);
        setDoctorData(data.profileData); // ✅ store profile globally
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching profile data");
    }
  };

  // ❌ Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  // ✅ Mark Appointment Complete
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  // 📊 Get Doctor Dashboard Data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { dToken },
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching dashboard data");
    }
  };

  // 🚪 Logout Function
  const logoutDoctor = () => {
    setDToken("");
    setDoctorData(null);
    setProfileData(false);
    localStorage.removeItem("dToken");
    localStorage.removeItem("doctorData");
    toast.success("Logged out successfully!");
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    doctorData,
    setDoctorData,
    logoutDoctor,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
