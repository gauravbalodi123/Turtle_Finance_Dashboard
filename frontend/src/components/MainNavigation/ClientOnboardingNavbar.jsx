import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../assets/images/logo_png.png'
import { RxExit } from "react-icons/rx";
import { FaRegQuestionCircle } from "react-icons/fa";

const ClientOnboardingNavbar = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    const handleLogout = async () => {
        try {
            await axios.get(`${url}/auth/logout`);
            navigate("/login", {
                state: { message: "You have been successfully logged out." },
            });
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${url}/auth/check-auth`);
                // Assuming your JWT token payload has "name" in it
                setUserName(res.data.name || "User");
            } catch (err) {
                console.error("Failed to fetch user info", err);
            }
        };
        fetchUser();
    }, [url]);



    return (
        <nav className="navbar fixed-top bg-white px-4  ">
            <div className="container-fluid d-flex justify-content-between  align-items-center">
                {/* Logo */}
                <a className="navbar-brand  d-flex align-items-center ">
                    <img src={logo} alt="Logo" className="img-fluid" style={{ height: "40px" }} />
                </a>

                {/* Buttons */}
                <div className="d-flex gap-3 align-items-center ">

                    {userName && <span className="fw-semibold text-uppercase">Welcome Back {userName} </span>}

                    <button className="btn btn-outline-turtle-secondary  rounded-2 px-3 fw-semibold d-flex gap-2 align-items-center">
                        <FaRegQuestionCircle />
                        Need Help?
                    </button>

                    <button
                        className="btn btn-outline-turtle-secondary rounded-2 px-3 fw-semibold d-flex gap-2 align-items-center"
                        onClick={handleLogout}
                    >
                        <RxExit />
                        Logout
                    </button>

                </div>
            </div>
        </nav>
    );
};

export default ClientOnboardingNavbar;
