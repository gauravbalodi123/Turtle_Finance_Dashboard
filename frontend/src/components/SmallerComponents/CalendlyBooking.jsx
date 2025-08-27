import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const url = import.meta.env.VITE_URL;

// Helper to load Calendly script
const loadCalendly = () =>
  new Promise((resolve) => {
    if (window.Calendly) return resolve();
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = resolve;
    document.body.appendChild(script);
  });

function CalendlyBooking() {
  const containerRef = useRef(null);
  const [userData, setUserData] = useState(null);

  // 1️⃣ Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/auth/check-auth`, {
          withCredentials: true,
        });
        setUserData(res.data); // res already has name, phone, email, role
      } catch (err) {
        console.error("Error loading user:", err.response?.data || err.message);
      }
    };

    fetchUser();
  }, []);

  // 2️⃣ Init Calendly once user data is ready
  useEffect(() => {
    let destroyed = false;

    const initCalendly = async () => {
      if (!userData) return;
      await loadCalendly();
      if (destroyed || !containerRef.current) return;

      containerRef.current.innerHTML = "";

      window.Calendly.initInlineWidget({
        url: "https://calendly.com/turtle-finance/turtle-kick-off-call",
        parentElement: containerRef.current,
        prefill: {
          name: userData.name || "",
          email: userData.email || "",
          customAnswers: {
            a1: userData.phone || "",
            a2: "Please add queries here" // optional second custom field
          }
        }
      });
    };

    initCalendly();

    return () => {
      destroyed = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [userData]);

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center p-0">
      {userData ? (
        <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
      ) : (
        <p>Loading booking widget...</p>
      )}
    </div>
  );
}

export default CalendlyBooking;
