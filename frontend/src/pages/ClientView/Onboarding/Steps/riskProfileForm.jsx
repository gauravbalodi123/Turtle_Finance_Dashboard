import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import '../../../../styles/ClientLayout/RiskProfileForm.module.css'
import "react-phone-input-2/lib/style.css";
// import TopTracker from "@components/TopTracker";
import axios from 'axios';
// import ClientOnboardingNavbar from "../../components/MainNavigation/ClientOnboardingNavbar";

const url = import.meta.env.VITE_URL;



const fields = [
    {
        name: "fullName",
        label: "Full Name*",
        note: "as per your PAN card",
        placeholder: "Type your answer here...",
        required: true,

        validation: {
            pattern: /^[a-zA-Z ]{3,}$/,
            errorMessage: "Please enter a valid full name (at least 3 letters)."
        }
    },
    {
        name: "panNumber",
        label: "PAN number*",
        note: "",
        placeholder: "ABCDE1234F",
        required: true,
        validation: {
            pattern: /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
            errorMessage: "Enter a valid PAN number (e.g., ABCDE1234F)"
        }
    },
    {
        name: "address1",
        label: "Address line 1*",
        note: "as per your Aadhaar card",
        placeholder: "Type your answer here...",
        required: true
    },
    {
        name: "address2",
        label: "Address line 2*",
        note: "as per your Aadhaar card (include your Pincode too)",
        placeholder: "Type your answer here...",
        required: true
    },
    {
        name: "phone",
        label: "Phone Number*",
        note: "",
        placeholder: "081234 56789",
        required: true,
        validation: {
            pattern: /^\+[1-9]\d{1,3}\d{7,12}$/,
            errorMessage: "Enter a valid international phone number (e.g. +919876543210)."
        }

    },
    {
        name: "email",
        label: "Email Address*",
        note: "",
        placeholder: "name@example.com",
        required: true,

        validation: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Enter a valid email address."
        }
    },
    { name: "gender", label: "Gender*", note: "", required: true },
    { name: "maritalStatus", label: "Marital Status*", note: "", required: true },
    { name: "dob", label: "Date of Birth*", note: "", required: true },
    {
        name: "dependents",
        label: "Number of loved ones who are financially dependent on you*",
        note: "",
        required: true
    },
    {
        name: "incomeSource",
        label: "Source of Income*",
        note: "",
        required: true
    },
    {
        name: "parentIncomeSource",
        label: "Parent's source of income*",
        note: "",
        required: true
    },
    {
        name: "currencyPreference",
        label: "What Currency would you like to share primary numbers in?*",
        note: "Feel free to use different currencies for for different questions if needed",
        required: true
    },
    {
        name: "currentMonthlyIncome",
        label: "What is your current monthly income?",
        placeholder: "Type your answer here...",
        description: "Please mention INR 5L as 500000",
        validation: {
            pattern: /^\d+$/,
            errorMessage: "Please enter a numeric amount."
        },
        required: true
    },
    {
        name: "currentExpenses",
        label: "What is your current monthly expenses?*",
        placeholder: "Type your answer here…",
        description: "Please mention INR 2L as 200000",
        validation: {
            pattern: /^\d+$/,
            errorMessage: "Please enter a numeric amount."
        },
        required: true
    },
    {
        name: "overallInvestment",
        label: "What is the approx. sum of your overall investment (total of EPF/Mutual Funds/PPF, FD etc)?*",
        placeholder: "Type your answer here...",
        description: "Please mention INR 10L as 1000000",
        validation: {
            pattern: /^\d+$/,
            errorMessage: "Please enter a numeric amount."
        },
        required: true
    },
    {
        name: "monthlyEMIs",
        label: "What is the sum total of all your EMIs (monthly numbers)?",
        placeholder: "Type your answer here...",
        description: "Please mention INR 5L as 500000",
        validation: {
            pattern: /^\d+$/,
            errorMessage: "Please enter a numeric amount."
        },
        required: true
    },
    {
        name: "investmentHorizon",
        label: "What is your investment horizon, i.e., how long can you keep your money invested in the market before needing access to it?*",
        note: "",
        required: true
    },
    {
        name: "investmentUnderstanding",
        label: "How well do you understand investing in the equity markets?*",
        note: "",
        required: true
    },
    {
        name: "incomeStability",
        label: "Nature of your current and future income sources are*",
        note: "(example: salary, business income, investment income, etc)",
        required: true
    },
    {
        name: "investmentObjective",
        label: "From the following 5 possible investment scenarios, please select the option that defines your investment objective.*",
        note: "",
        required: true
    },
    {
        name: "investmentResilience",
        label: "If your investment outlook is long-term (more than five years), how long will you hold on to a poorly performing portfolio before cashing in?*",
        note: "",
        required: true
    },
    {
        name: "portfolioReaction",
        label: "If a few months after investing, the value of your investments declines by 20%, what would you do?*",
        note: "",
        required: true
    }
];


const RiskProfileForm = ({ onNext, onPrev, updateData, data }) => {
    const navigate = useNavigate();
    const [fieldError, setFieldError] = useState("");

    // const [loading, setLoading] = useState(true);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [step, setStep] = useState(0);
    console.log("Current Step:", step);

    const [formData, setFormData] = useState({});
    // const [customGenderChoices, setCustomGenderChoices] = useState([]);
    const [genderChoice, setGenderChoice] = useState("");
    // const [customMaritalChoices, setCustomMaritalChoices] = useState([]);
    const [maritalChoice, setMaritalChoice] = useState("");
    const [dependentsRows, setDependentsRows] = useState([
        "Son(s)", "Daughter(s)", "Dependent Parent(s)", "Dependent Sibling(s)", "Dependent Parent-in-law(s)"
    ]);
    const [dependentsCols, setDependentsCols] = useState(["None", "1", "2"]);
    const [dependentsData, setDependentsData] = useState({});
    const [incomeChoices, setIncomeChoices] = useState([
        "Stable (Govt Job or Secure Private - example - Tata Steel, Reliance, LT)",
        "Profession - Doctor/Lawyer/Accountant/Architect",
        "Pvt - High Income at beginning but would peak and last as 15-20 years career - Marketing, Consulting, Tech jobs",
        "Self Business - Growth industry (10%+ YoY Growth)",
        "Business - Moderate Growth Industry (<10% YoY Growth)",
        "Retired - Pension",
        "Retired - No Pension",
    ]);
    // const [customIncomeChoices, setCustomIncomeChoices] = useState([]);
    const [selectedIncome, setSelectedIncome] = useState("");
    const [parentIncomeChoices, setParentIncomeChoices] = useState([
        "Pension - Government / Or retirement planning",
        "Currently Working - Govt",
        "Currently Working - Private",
        "No Pension, lacked retirement planning",
        "Not Applicable (Parents not alive)"
    ]);
    const [selectedParentIncome, setSelectedParentIncome] = useState("");

    const [currencyChoices, setCurrencyChoices] = useState([
        "Indian Rupee (INR)",
        "United States Dollar (USD)",
        "Great Britain Pound (GBP)",
        "Euros (EUR)",
        "Other"
    ]);
    const [selectedCurrency, setSelectedCurrency] = useState("");

    const [investmentHorizonChoices, setInvestmentHorizonChoices] = useState([
        "Upto 2 years",
        "2-3 years",
        "3-5 years",
        "5-10 years",
        "10+ years"
    ]);
    const [selectedHorizon, setSelectedHorizon] = useState("");

    const [investmentUnderstandingChoices, setInvestmentUnderstandingChoices] = useState([
        "I am a novice. I don’t understand the markets at all",
        "I have basic understanding of investing. I understand the risks and basic investment",
        "I have an amateur interest in investing. I have invested earlier on my own. I understand how markets fluctuate and the pros and cons of different investment classes.",
        "I am an experienced investor. I have invested in different markets and understand different investment strategies. I have my own investment philosophy."
    ]);
    const [selectedUnderstanding, setSelectedUnderstanding] = useState("");

    const [incomeStabilityChoices, setIncomeStabilityChoices] = useState([
        "Very unstable",
        "Unstable",
        "Somewhat stable",
        "Stable",
        "Very Stable"
    ]);
    const [selectedStability, setSelectedStability] = useState("");

    const [investmentObjectiveChoices, setInvestmentObjectiveChoices] = useState([
        "I cannot consider any Loss",
        "I can consider Loss of 4% if the possible Gains are of 10%",
        "I can consider Loss of 8% if the possible Gains are of 22%",
        "I can consider Loss of 14% if the possible Gains are of 30%",
        "I can consider Loss of 25% if the possible Gains are of 50%"
    ]);
    const [selectedObjective, setSelectedObjective] = useState("");

    const [investmentResilienceChoices, setInvestmentResilienceChoices] = useState([
        "Will not hold & cash in immediately if there is an erosion of my capital",
        "I’d hold for 3 months",
        "I’d hold for 6 months",
        "I’d hold for one year",
        "I’d hold for up to two years",
        "I’d hold for more than two years."
    ]);
    const [selectedResilience, setSelectedResilience] = useState("");

    const [portfolioReactionChoices, setPortfolioReactionChoices] = useState([
        "Cut losses immediately and liquidate all investments. Capital preservation is paramount.",
        "Cut your losses and transfer investments to safer asset classes.",
        "You would be worried, but would give your investments a little more time.",
        "You are ok with volatility and accept decline in portfolio value as a part of investing. You would keep your investments as they are",
        "You would add to your investments to bring the average buying price lower. You are confident about your investments and are not perturbed by notional losses."
    ]);
    const [selectedReaction, setSelectedReaction] = useState("");

    useEffect(() => {
        const checkExistingProfile = async () => {
            try {
                // const token = localStorage.getItem("token");
                const response = await axios.get(`${url}/client/riskData`);
                console.log("Checking....");
                console.log(response.data)
                console.log(response.data.exists)
                if (response.data && (response.data.riskProfileExists ||
                    response.data.fullName ||
                    response.data.panNumber)) {
                    // setAlreadySubmitted(true);
                    //  // Redirect immediately if already submitted
                    onNext();
                    return;
                }
            } catch (err) {
                console.error("Error checking risk profile:", err);
            } finally {
                setLoading(false);
            }
        };

        checkExistingProfile();
    }, [navigate]);








    const handleFinalSubmit = async (e) => {
        if (e) e.preventDefault();


        const transformedDependentsData = Object.fromEntries(
            Object.entries(dependentsData).map(([key, value]) => [
                key,
                value === "None" ? 0 : Number(value),
            ])
        );

        // Now send transformedDependentsData to the backend
        console.log("Submitting:", transformedDependentsData);

        try {
            // Transform the data to match the required format
            const payload = {
                fullName: formData.fullName || '',
                panNumber: formData.panNumber ? formData.panNumber.toUpperCase() : '',
                addressLine1: formData.address1 || '',
                addressLine2: formData.address2 || '',
                phoneNumber: formData.phone || '',
                emailAddress: formData.email || '',
                gender: genderChoice || '',
                maritalStatus: maritalChoice || '',
                dateOfBirth: formData.dobYear && formData.dobMonth && formData.dobDay
                    ? new Date(`${formData.dobYear}-${formData.dobMonth.padStart(2, '0')}-${formData.dobDay.padStart(2, '0')}`)
                    : '',
                // ✅ Use transformedDependentsData here
                sons: transformedDependentsData['Son(s)'] || 0,
                daughters: transformedDependentsData['Daughter(s)'] || 0,
                dependentParents: transformedDependentsData['Dependent Parent(s)'] || 0,
                dependentSiblings: transformedDependentsData['Dependent Sibling(s)'] || 0,
                dependentParentsInLaw: transformedDependentsData['Dependent Parent-in-law(s)'] || 0,
                sourceOfIncome: selectedIncome || '',
                parentsSourceOfIncome: selectedParentIncome || '',
                currencyType: selectedCurrency || '',
                currentMonthlyIncome: formData.currentMonthlyIncome ? parseInt(formData.currentMonthlyIncome) : 0,
                currentMonthlyExpenses: formData.currentExpenses ? parseInt(formData.currentExpenses) : 0,
                totalInvestment: formData.overallInvestment ? parseInt(formData.overallInvestment) : 0,
                totalEmis: formData.monthlyEMIs ? parseInt(formData.monthlyEMIs) : 0,
                investmentHorizon: selectedHorizon || '',
                equityMarketKnowledge: selectedUnderstanding || '',
                incomeNature: selectedStability || '',
                investmentObjective: selectedObjective || '',
                holdingPeriodForLoss: selectedResilience || '',
                reactionToDecline: selectedReaction || ''
            };

            console.log("Final payload:", payload); // For debugging

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${url}/client/addRiskData`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // alert(response.data.msg);
            onNext();
            // onComplete();

        } catch (err) {
            console.error('Submission error:', err);
            if (err.response) {
                console.error('Response data:', err.response.data);
                // alert(err.response.data.message || 'Submission failed');
            } else {
                // alert('Network error. Please try again.');
            }
        }
    };






    const handleChange = (e) => {
        let { value } = e.target;
        const currentField = fields[step];

        const error = validateField(currentField, value);

        setFieldError(error || "");
        setFormData({ ...formData, [currentField.name]: value });
    };


    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
        else onPrev();
    };

    const handleNext = () => {
        const currentField = fields[step];

        // ✅ Special case: DOB uses three fields
        if (currentField.name === "dob") {
            const { dobDay, dobMonth, dobYear } = formData;
            if (!dobDay || !dobMonth || !dobYear) {
                alert("This field is required.");
                return;
            }
        } else {
            const value = formData[currentField.name];
            const error = validateField(currentField, value);
            if (error) {
                alert(error);
                return;
            }
        }

        if (step < fields.length - 1) {
            setStep(step + 1);
        } else {
            handleFinalSubmit();
            console.log("Form submitted:", formData);
        }
    };





    // const handleStart = () => setStep(0);

    // const handleSelect = (fieldName, value, setter) => {
    //     setFormData({ ...formData, [fieldName]: value });
    //     setter(value);
    // };

    const handleSelect = (fieldName, value, setter) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // ✅ run validation here too
        const field = fields.find(f => f.name === fieldName);
        const error = validateField(field, value);
        setFieldError(error || "");

        setter(value);
    };


    const handleKeyDown = (e, fieldName, value, setter) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSelect(fieldName, value, setter);
            goNextStep(); // <-- your function to go to next step
        }
    };

    const validateField = (field, value) => {


        // ✅ Special case: Dependents (check if all rows have a value)
        if (field.name === "dependents") {
            const allAnswered = dependentsRows.every(row => dependentsData[row]);
            if (!allAnswered) {
                return "Please select an option for each dependent.";
            }
            return null; // valid
        }

        // ✅ Normal required field
        if (field.required && !value?.toString().trim()) {
            return "This field is required.";
        }

        if (field.name === "phone" && value) {
            const digitsOnly = value.replace(/[^\d]/g, ""); // removes +, spaces, -, etc.
            const sanitized = `+${digitsOnly}`;
            if (!field.validation.pattern.test(sanitized)) {
                return field.validation.errorMessage;
            }
        }

        // ✅ Pattern-based validation
        else if (field.validation?.pattern && !field.validation.pattern.test(value)) {
            return field.validation.errorMessage;
        }

        return null; // all good
    };






    const addDependentRow = () => setDependentsRows([...dependentsRows, ""]);
    const addDependentColumn = () => setDependentsCols([...dependentsCols, String(dependentsCols.length)]);
    const handleDependentRadio = (row, col) => setDependentsData({ ...dependentsData, [row]: col });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`${url}/auth/check-auth`, { withCredentials: true });
                // Prefill formData with API values
                setFormData((prev) => ({
                    ...prev,
                    fullName: res.data.name || "",
                    phone: res.data.phone || "",
                    email: res.data.email || ""
                }));
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);



    useEffect(() => {
        const currentField = fields[step];
        const value = formData[currentField.name];

        // Re-run validation for the current step on step change
        const error = validateField(currentField, value);
        setFieldError(error || "");
    }, [step, fields, formData]);

    // clear any stale error when changing steps
    useEffect(() => {
        setFieldError("");
    }, [step]);


    useEffect(() => {
        if (formData.dobDay && formData.dobMonth && formData.dobYear) {
            setFieldError(null); // or however you clear errors
        }
    }, [formData.dobDay, formData.dobMonth, formData.dobYear]);





    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleNext();
            }}
        >
            <div className="container-fluid  p-0">

                <div className="  d-flex align-items-center justify-content-center p-5 border border-secondary border-opacity-25 border-2 rounded-3 ">
                    <div className="w-100  mx-auto text-dark" >
                        {/* <div className="d-flex justify-content-end mt-0  mb-0">
                        <img src="/src/assets/images/logo_png.png" alt="Turtle Logo" className="" style={{ maxWidth: '150px', maxHeight: '200px' }} />
                    </div> */}

                        <div>
                            <p className="mb-1 fs-5">{step + 1} → {fields[step].label}</p>
                            <p className="mb-2 text-muted ">{fields[step].note}</p>

                            {fields[step].name === "phone" ? (
                                <div>
                                    <PhoneInput
                                        country={"in"}
                                        value={formData.phone || ""}
                                        onChange={(phone) => {
                                            setFormData({ ...formData, phone });
                                            const error = validateField(fields[step], phone);
                                            setFieldError(error || "");
                                        }}
                                        inputClass="form-control form-control-lg fs-5 ps-5 w-100 py-2 border-bottom border-secondary"
                                        buttonClass="border-bottom border-secondary"
                                        containerClass="mb-4"
                                    />
                                    {fieldError && (
                                        <div className="text-danger">{fieldError}</div>
                                    )}

                                </div>
                            ) : fields[step].name === "gender" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSelect("gender", "Male", setGenderChoice)}
                                            className={`rounded-pill px-3 py-2 border text-start ${genderChoice === "Male" ? "bg-turtle-primary" : "bg-light"}`}>
                                            Ⓐ Male
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSelect("gender", "Female", setGenderChoice)}
                                            className={`rounded-pill px-3 py-2 border text-start ${genderChoice === "Female" ? "bg-turtle-primary" : "bg-light"}`}>
                                            Ⓑ Female
                                        </button>
                                        {/* {customGenderChoices.map((choice, idx) => (
                                        <input key={idx} type="text" placeholder="Custom choice..." value={choice} onChange={(e) => updateCustomChoice("gender", idx, e.target.value)} className="form-control border-bottom fs-5 py-1 px-2" />
                                    ))} */}
                                    </div>
                                    {/* <button onClick={() => addCustomChoice("gender")} className="text-decoration-underline fs-6 text-dark mt-1"></button> */}
                                </div>
                            ) : fields[step].name === "maritalStatus" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {["Married", "Unmarried", "Divorced", "Separated", "Widow/Widower"].map((label, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() => handleSelect("maritalStatus", label, setMaritalChoice)}
                                                className={`rounded-pill px-3 py-2 border text-start ${maritalChoice === label ? "bg-turtle-primary" : "bg-light"}`}
                                            >
                                                {String.fromCharCode(65 + i)}. {label}
                                            </button>
                                        ))}
                                        {/* {customMaritalChoices.map((choice, idx) => (
                                        <input key={idx} type="text" placeholder="Custom choice..." value={choice} onChange={(e) => updateCustomChoice("marital", idx, e.target.value)} className="form-control border-bottom fs-5 py-1 px-2" />
                                    ))} */}
                                    </div>
                                    {/* <button onClick={() => addCustomChoice("marital")} className="text-decoration-underline fs-6 text-dark mt-1"></button> */}
                                </div>
                            ) : fields[step].name === "dob" ? (
                                <div className="mb-4">
                                    <div className="row g-3">
                                        <div className="col-1">
                                            <label className="form-label text-muted fs-6">Day</label>
                                            <select
                                                className="form-select fs-5 py-2"
                                                value={formData.dobDay || ""}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        dobDay: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">DD</option>
                                                {[...Array(31)].map((_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-1">
                                            <label className="form-label text-muted fs-6">Month</label>
                                            <select
                                                className="form-select fs-5 py-2"
                                                value={formData.dobMonth || ""}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        dobMonth: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">MM</option>
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-1">
                                            <label className="form-label text-muted fs-6">Year</label>
                                            <select
                                                className="form-select fs-5 py-2"
                                                value={formData.dobYear || ""}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        dobYear: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">YYYY</option>
                                                {[...Array(100)].map((_, i) => {
                                                    const year = new Date().getFullYear() - i;
                                                    return <option key={i} value={year}>{year}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            ) : fields[step].name === "dependents" ? (
                                <div className="mb-4">
                                    <div className="table-responsive">
                                        <table className="table w-100 text-start align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="text-start px-3"></th>
                                                    {dependentsCols.map((col, i) => (
                                                        <th key={i} className="text-center px-3">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dependentsRows.map((row, i) => (
                                                    <tr key={i}>
                                                        <td className="px-3 py-2 align-middle">
                                                            <span className="fw-medium">{row}</span>
                                                        </td>
                                                        {dependentsCols.map((col, j) => (
                                                            <td key={j} className="text-center  align-middle">
                                                                <div className="form-check d-flex justify-content-center ">
                                                                    <input
                                                                        className="form-check-input border border-1 border-dark"
                                                                        type="radio"
                                                                        name={`dependent-${i}`}
                                                                        checked={dependentsData[row] === col}
                                                                        onChange={() => handleDependentRadio(row, col)}
                                                                    />
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                            ) : fields[step].name === "incomeSource" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {incomeChoices.map((choice, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect("incomeSource", choice, setSelectedIncome)
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedIncome === choice ? "bg-turtle-primary" : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choice}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : fields[step].name === "parentIncomeSource" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {parentIncomeChoices.map((choice, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect("parentIncomeSource", choice, setSelectedParentIncome)
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedParentIncome === choice ? "bg-turtle-primary" : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choice}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            ) : fields[step].name === "investmentHorizon" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {investmentHorizonChoices.map((choiceObj, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect("investmentHorizon", choiceObj.value || choiceObj, setSelectedHorizon)
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedHorizon === (choiceObj.value || choiceObj)
                                                    ? "bg-turtle-primary"
                                                    : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
                                            </button>
                                        ))}
                                    </div>
                                </div>


                            ) : fields[step].name === "currencyPreference" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {currencyChoices.map((choice, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect("currencyPreference", choice.value || choice, setSelectedCurrency)
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedCurrency === (choice.value || choice) ? "bg-turtle-primary" : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choice.value || choice}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            ) : fields[step].name === "incomeStability" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {incomeStabilityChoices.map((choiceObj, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect("incomeStability", choiceObj.value || choiceObj, setSelectedStability)
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedStability === (choiceObj.value || choiceObj)
                                                    ? "bg-turtle-primary"
                                                    : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            ) : fields[step].name === "investmentUnderstanding" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {investmentUnderstandingChoices.map((choiceObj, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect("investmentUnderstanding", choiceObj.value || choiceObj, setSelectedUnderstanding)
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedUnderstanding === (choiceObj.value || choiceObj)
                                                    ? "bg-turtle-primary"
                                                    : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            ) : fields[step].name === "investmentObjective" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {investmentObjectiveChoices.map((choiceObj, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect(
                                                        "investmentObjective",
                                                        choiceObj.value || choiceObj,
                                                        setSelectedObjective
                                                    )
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedObjective === (choiceObj.value || choiceObj)
                                                    ? "bg-turtle-primary"
                                                    : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            ) : fields[step].name === "investmentResilience" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {investmentResilienceChoices.map((choiceObj, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect(
                                                        "investmentResilience",
                                                        choiceObj.value || choiceObj,
                                                        setSelectedResilience
                                                    )
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedResilience === (choiceObj.value || choiceObj)
                                                    ? "bg-turtle-primary"
                                                    : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            ) : fields[step].name === "portfolioReaction" ? (
                                <div className="mb-3">
                                    <div className="d-flex flex-column gap-2">
                                        {portfolioReactionChoices.map((choiceObj, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() =>
                                                    handleSelect(
                                                        "portfolioReaction",
                                                        choiceObj.value || choiceObj,
                                                        setSelectedReaction
                                                    )
                                                }
                                                className={`rounded-pill px-4 py-2 border ${selectedReaction === (choiceObj.value || choiceObj)
                                                    ? "bg-turtle-primary"
                                                    : "bg-light"
                                                    } text-start`}
                                            >
                                                {String.fromCharCode(65 + i)}. {choiceObj.value || choiceObj}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            ) : fields[step].name === "currentMonthlyIncome" ? (
                                <div className="mb-3">
                                    <p className="text-muted small">{fields[step].description}</p>
                                    <input
                                        type="number"
                                        placeholder={fields[step].placeholder}
                                        className="form-control border-bottom fs-4 text-dark mb-4 placeholder-secondary py-2"
                                        value={formData[fields[step].name] || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            ) : (
                                <div className="mb-3">
                                    {fields[step].description && (
                                        <p className="text-muted small">{fields[step].description}</p>
                                    )}
                                    <input
                                        type="text"
                                        className="form-control border-bottom fs-4 text-dark mb-4 placeholder-secondary py-2"
                                        placeholder={fields[step].placeholder}
                                        value={formData[fields[step].name] || ""}
                                        onChange={handleChange}

                                    />
                                    {fieldError && (
                                        <div className="text-danger ">{fieldError}</div>
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-start gap-5 mt-4">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="btn btn-outline-turtle-secondary rounded-pill  border px-4 py-3 fs-6 fw-medium shadow-sm"
                                    disabled={step === 0}
                                >
                                    ← Previous
                                </button>

                                <button
                                    type="submit"
                                    onKeyDown={(e) => handleKeyDown(e, "incomeSource", choice, setSelectedIncome)}
                                    className="btn bg-turtle-primary rounded-pill btn-sm border px-4 py-3 fs-6 fw-medium shadow-sm"
                                    disabled={
                                        fields[step].required && (
                                            (
                                                fields[step].name === "dob"
                                                    ? (!formData.dobDay || !formData.dobMonth || !formData.dobYear) // ✅ custom DOB check
                                                    : fields[step].name === "dependents"
                                                        ? dependentsRows.some(row => !dependentsData[row])
                                                        : (
                                                            formData[fields[step].name] === undefined ||
                                                            formData[fields[step].name].toString().trim() === "" ||
                                                            (
                                                                ["currentMonthlyIncome", "currentMonthlyExpenses", "overallInvestment", "monthlyEMIs"].includes(fields[step].name) &&
                                                                isNaN(Number(formData[fields[step].name]))
                                                            )
                                                        )
                                            ) || !!fieldError
                                        )
                                    }

                                >
                                    {step === fields.length - 1 ? "Submit" : "Next"}
                                </button>



                            </div>


                        </div>

                    </div>
                </div>
            </div>
        </form>
    );
};

export default RiskProfileForm;
