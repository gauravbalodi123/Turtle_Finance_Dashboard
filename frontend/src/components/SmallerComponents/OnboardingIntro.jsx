import React from "react";
import { FaStethoscope, FaIdCard, FaFileSignature, FaCreditCard, FaPhone } from "react-icons/fa";
import styles from '../../styles/SmallerComponents/OnboardingIntro.module.css';
import { FiClock } from "react-icons/fi";

const OnboardingIntro = ({ onNext }) => {
    return (
        <div className={`container-fluid px-5`}>
            <div className="text-dark">
                <div className="d-flex flex-column mt-5">

                    <h2 className="fw-bold fs-2 mb-2">
                        Welcome to Turtle - Let us Get you Onboarded!
                    </h2>
                    <p className="text-secondary fs-5 mb-4">
                        As per SEBI regulations we need to complete the following 5 steps to complete your onboarding:
                    </p>

                    <div className="row row-cols-1 row-cols-md-5 g-4 justify-content-center mb-5">
                        {[
                            {
                                step: 1,
                                title: "Risk Assessment",
                                time: "5-10 minutes",
                                desc: "It begins with knowing your risk appetite.",
                                icon: <FaStethoscope size={30} color="#000" />,
                            },
                            {
                                step: 2,
                                title: "KYC",
                                time: "2-3 minutes",
                                desc: "Please keep your Aadhaar card and PAN card handy.",
                                icon: <FaIdCard size={30} color="#000" />,
                            },
                            {
                                step: 3,
                                title: "Agreement Sign",
                                time: "3-4 minutes",
                                desc: "Let us make this official and sign the Advisory Agreement :)",
                                icon: <FaFileSignature size={30} color="#000" />,
                            },
                            {
                                step: 4,
                                title: "Payment",
                                time: "2-3 minutes",
                                desc: "Make the payment to activate your membership.",
                                icon: <FaCreditCard size={30} color="#000" />,
                            },
                            {
                                step: 5,
                                title: "Book Kick-off Call",
                                time: "2-3 minutes",
                                desc: "Schedule your introductory call with our advisor.",
                                icon: <FaPhone size={30} color="#000" />,
                            },
                        ].map(({ step, title, time, desc, icon }) => (
                            <div className="col" key={step}>
                                <div className="card h-100 shadow border-0">
                                    <div className="card-body text-center">
                                        <div className="bg-turtle-primary"
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: "0 auto 10px auto"
                                            }}
                                        >
                                            {icon}
                                        </div>
                                        <span className="badge bg-turtle-primary rounded-pill px-4 py-2 mb-2">
                                            Step - {step}
                                        </span>
                                        <h5 className="card-title fw-bold">{title}</h5>
                                        <p className="card-subtitle text-muted mb-2">
                                            <FiClock style={{ marginRight: "4px" }} /> {time}
                                        </p>
                                        <p className="card-text text-secondary small">{desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onNext}
                        className="btn align-self-start btn-dark btn-lg px-4 fw-bold shadow-sm"
                    >
                        Begin Onboarding <span className="ms-1">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingIntro;
