import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const ClientRiskProfile = () => {
  axios.defaults.withCredentials = true;
  const url = import.meta.env.VITE_URL;
  const { clientId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDigioForm, setShowDigioForm] = useState(false); // ✅ State to toggle form

  // Refs for each field
  const fullNameRef = useRef();
  const panNumberRef = useRef();
  const addressLine1Ref = useRef();
  const addressLine2Ref = useRef();
  const phoneNumberRef = useRef();
  const emailAddressRef = useRef();
  const genderRef = useRef();
  const maritalStatusRef = useRef();
  const dateOfBirthRef = useRef();
  const sonsRef = useRef();
  const daughtersRef = useRef();
  const dependentParentsRef = useRef();
  const dependentSiblingsRef = useRef();
  const dependentParentsInLawRef = useRef();
  const sourceOfIncomeRef = useRef();
  const parentsSourceOfIncomeRef = useRef();
  const currencyTypeRef = useRef();
  const currentMonthlyIncomeRef = useRef();
  const currentMonthlyExpensesRef = useRef();
  const totalInvestmentRef = useRef();
  const totalEmisRef = useRef();
  const investmentHorizonRef = useRef();
  const equityMarketKnowledgeRef = useRef();
  const incomeNatureRef = useRef();
  const investmentObjectiveRef = useRef();
  const holdingPeriodForLossRef = useRef();
  const reactionToDeclineRef = useRef();
  const resultRef = useRef();

  useEffect(() => {
    const controller = new AbortController();

    const fetchRiskProfile = async () => {
      try {
        const res = await axios.get(`${url}/admin/clients/${clientId}/riskProfile`, { signal: controller.signal });
        const data = res.data.data;

        const formatDate = (isoDate) => {
          if (!isoDate) return "";
          const date = new Date(isoDate);
          return date.toISOString().split("T")[0];
        };

        setFormData({
          ...data,
          dateOfBirth: formatDate(data.dateOfBirth)
        });
      } catch (error) {
        console.error("Error fetching risk profile:", error);
      }
    };

    fetchRiskProfile();

    return () => controller.abort();
  }, [clientId]);
  //}, [clientId, profileId, url]);


  const getValueOrNull = (ref) => {
    const value = ref.current?.value?.trim();
    return value === "" ? null : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      fullName: getValueOrNull(fullNameRef),
      panNumber: getValueOrNull(panNumberRef),
      addressLine1: getValueOrNull(addressLine1Ref),
      addressLine2: getValueOrNull(addressLine2Ref),
      phoneNumber: getValueOrNull(phoneNumberRef),
      emailAddress: getValueOrNull(emailAddressRef),
      gender: getValueOrNull(genderRef),
      maritalStatus: getValueOrNull(maritalStatusRef),
      dateOfBirth: getValueOrNull(dateOfBirthRef),
      sons: Number(getValueOrNull(sonsRef)),
      daughters: Number(getValueOrNull(daughtersRef)),
      dependentParents: Number(getValueOrNull(dependentParentsRef)),
      dependentSiblings: Number(getValueOrNull(dependentSiblingsRef)),
      dependentParentsInLaw: Number(getValueOrNull(dependentParentsInLawRef)),
      sourceOfIncome: getValueOrNull(sourceOfIncomeRef),
      parentsSourceOfIncome: getValueOrNull(parentsSourceOfIncomeRef),
      currencyType: getValueOrNull(currencyTypeRef),
      currentMonthlyIncome: Number(getValueOrNull(currentMonthlyIncomeRef)),
      currentMonthlyExpenses: Number(getValueOrNull(currentMonthlyExpensesRef)),
      totalInvestment: Number(getValueOrNull(totalInvestmentRef)),
      totalEmis: Number(getValueOrNull(totalEmisRef)),
      investmentHorizon: getValueOrNull(investmentHorizonRef),
      equityMarketKnowledge: getValueOrNull(equityMarketKnowledgeRef),
      incomeNature: getValueOrNull(incomeNatureRef),
      investmentObjective: getValueOrNull(investmentObjectiveRef),
      holdingPeriodForLoss: getValueOrNull(holdingPeriodForLossRef),
      reactionToDecline: getValueOrNull(reactionToDeclineRef),
      result: getValueOrNull(resultRef),
    };

    try {
      await axios.patch(`${url}/admin/clients/${clientId}/riskProfile`, updatedData);
      alert("Risk Profile updated successfully!");
    } catch (error) {
      console.error("Error updating risk profile:", error);
      alert("Failed to update risk profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <p>Loading Risk Profile...</p>;

  return (
    <form className="container my-4" onSubmit={handleSubmit}>
      <div className="card p-4 shadow">
        <Link
          to={`/adminautharized/admin/clients/${clientId}/digio-response`}
          className="btn btn-outline-secondary mb-3"
        >
          Go to Digio Response Form
        </Link>

        <Link
          to={`/adminautharized/admin/clients/${clientId}/kycAdmin`}
          className="btn btn-outline-secondary mb-3"
        >
          Go to KYC Response Form
        </Link>

        <h2 className="mb-3">Edit Risk Profile</h2>

        <div className="mb-3">
          <label className="form-label">Your Risk Profile Status:</label>
          <input type="text" className="form-control" ref={resultRef} defaultValue={formData.result} required />
        </div>


        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" ref={fullNameRef} defaultValue={formData.fullName} required />
        </div>

        <div className="mb-3">
          <label className="form-label">PAN Number</label>
          <input type="text" className="form-control" ref={panNumberRef} defaultValue={formData.panNumber} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 1</label>
          <input type="text" className="form-control" ref={addressLine1Ref} defaultValue={formData.addressLine1} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 2</label>
          <input type="text" className="form-control" ref={addressLine2Ref} defaultValue={formData.addressLine2} />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="text" className="form-control" ref={phoneNumberRef} defaultValue={formData.phoneNumber} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-control" ref={emailAddressRef} defaultValue={formData.emailAddress} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select className="form-select" ref={genderRef} defaultValue={formData.gender}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Null">Null</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Marital Status</label>
          <select className="form-select" ref={maritalStatusRef} defaultValue={formData.maritalStatus} required>
            <option value="Unmarried">Unmarried</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Separated">Separated</option>
            <option value="Widow">Widow</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" ref={dateOfBirthRef} defaultValue={formData.dateOfBirth} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Sons</label>
          <input type="number" className="form-control" ref={sonsRef} defaultValue={formData.sons} />
        </div>

        <div className="mb-3">
          <label className="form-label">Daughters</label>
          <input type="number" className="form-control" ref={daughtersRef} defaultValue={formData.daughters} />
        </div>

        <div className="mb-3">
          <label className="form-label">Dependent Parents</label>
          <input type="number" className="form-control" ref={dependentParentsRef} defaultValue={formData.dependentParents} />
        </div>

        <div className="mb-3">
          <label className="form-label">Dependent Siblings</label>
          <input type="number" className="form-control" ref={dependentSiblingsRef} defaultValue={formData.dependentSiblings} />
        </div>

        <div className="mb-3">
          <label className="form-label">Dependent Parents-In-Law</label>
          <input type="number" className="form-control" ref={dependentParentsInLawRef} defaultValue={formData.dependentParentsInLaw} />
        </div>

        <div className="mb-3">
          <label className="form-label">Source of Income</label>
          <select className="form-select" ref={sourceOfIncomeRef} defaultValue={formData.sourceOfIncome} required>
            <option value="Stable (Govt Job or Secure Private - example - Tata Steel, Reliance, LT)">
              Stable (Govt Job or Secure Private - example - Tata Steel, Reliance, LT)
            </option>
            <option value="Profession - Doctor/Lawyer/Accountant/Architect">
              Profession - Doctor/Lawyer/Accountant/Architect
            </option>
            <option value="Pvt - High Income at beginning but would peak and last as 15-20 years career - Marketing, Consulting, Tech jobs">
              Pvt - High Income at beginning but would peak and last as 15-20 years career - Marketing, Consulting, Tech jobs
            </option>
            <option value="Self Business - Growth industry (10%+ YoY Growth)">
              Self Business - Growth industry (10%+ YoY Growth)
            </option>
            <option value="Business - Moderate Growth Industry (<10% YoY Growth)">
              Business - Moderate Growth Industry (10% YoY Growth)
            </option>
            <option value="Retired - Pension">Retired - Pension</option>
            <option value="Retired - No Pension">Retired - No Pension</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Parents' Source of Income</label>
          <select className="form-select" ref={parentsSourceOfIncomeRef} defaultValue={formData.parentsSourceOfIncome} required>
            <option value="Pension - Government / Or retirement planning">
              Pension - Government / Or retirement planning
            </option>
            <option value="Currently Working - Govt">Currently Working - Govt</option>
            <option value="Currently Working - Private">Currently Working - Private</option>
            <option value="No Pension, lacked retirement planning">
              No Pension, lacked retirement planning
            </option>
            <option value="Not Applicable (Parents not alive)">
              Not Applicable (Parents not alive)
            </option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Currency Type</label>
          <select className="form-select" ref={currencyTypeRef} defaultValue={formData.currencyType}>
            <option value="Indian Rupee (INR)">Indian Rupee (INR)</option>
            <option value="United States Dollar (USD)">United States Dollar (USD)</option>
            <option value="Great Britain Pound (GBP)">Great Britain Pound (GBP)</option>
            <option value="Euros (EUR)">Euros (EUR)</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Current Monthly Income</label>
          <input type="number" className="form-control" ref={currentMonthlyIncomeRef} defaultValue={formData.currentMonthlyIncome} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Current Monthly Expenses</label>
          <input type="number" className="form-control" ref={currentMonthlyExpensesRef} defaultValue={formData.currentMonthlyExpenses} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Investment</label>
          <input type="number" className="form-control" ref={totalInvestmentRef} defaultValue={formData.totalInvestment} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Total EMIs</label>
          <input type="number" className="form-control" ref={totalEmisRef} defaultValue={formData.totalEmis} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Investment Horizon</label>
          <select className="form-select" ref={investmentHorizonRef} defaultValue={formData.investmentHorizon} required>
            <option value="Upto 2 years">Upto 2 years</option>
            <option value="2-3 years">2-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Equity Market Knowledge</label>
          <select className="form-select" ref={equityMarketKnowledgeRef} defaultValue={formData.equityMarketKnowledge} required>
            <option value="I am a novice. I don't understand the markets at all">
              I am a novice. I don't understand the markets at all
            </option>
            <option value="I have basic understanding of investing. I understand the risks and basic investment">
              I have basic understanding of investing. I understand the risks and basic investment
            </option>
            <option value="I have an amateur interest in investing. I have invested earlier on my own. I understand how markets fluctuate and the pros and cons of different investment classes.">
              I have an amateur interest in investing. I have invested earlier on my own. I understand how markets fluctuate and the pros and cons of different investment classes.
            </option>
            <option value="I am an experienced investor. I have invested in different markets and understand different investment strategies. I have my own investment philosophy.">
              I am an experienced investor. I have invested in different markets and understand different investment strategies. I have my own investment philosophy.
            </option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Income Nature</label>
          <select className="form-select" ref={incomeNatureRef} defaultValue={formData.incomeNature} required>
            <option value="Very unstable">Very unstable</option>
            <option value="Unstable">Unstable</option>
            <option value="Somewhat stable">Somewhat stable</option>
            <option value="Stable">Stable</option>
            <option value="Very Stable">Very Stable</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Investment Objective</label>
          <select className="form-select" ref={investmentObjectiveRef} defaultValue={formData.investmentObjective} required>
            <option value="I cannot consider any Loss">I cannot consider any Loss</option>
            <option value="I can consider Loss of 4% if the possible Gains are of 10%">
              I can consider Loss of 4% if the possible Gains are of 10%
            </option>
            <option value="I can consider Loss of 8% if the possible Gains are of 22%">
              I can consider Loss of 8% if the possible Gains are of 22%
            </option>
            <option value="I can consider Loss of 14% if the possible Gains are of 30%">
              I can consider Loss of 14% if the possible Gains are of 30%
            </option>
            <option value="I can consider Loss of 25% if the possible Gains are of 50%">
              I can consider Loss of 25% if the possible Gains are of 50%
            </option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Holding Period for Loss</label>
          <select
            className="form-select"
            ref={holdingPeriodForLossRef}
            defaultValue={formData.holdingPeriodForLoss}
            required
          >
            <option value="Will not hold & cash in immediately if there is an erosion of my capital">
              Will not hold & cash in immediately if there is an erosion of my capital
            </option>
            <option value="I’d hold for 3 months">I’d hold for 3 months</option>
            <option value="I’d hold for 6 months">I’d hold for 6 months</option>
            <option value="I’d hold for one year">I’d hold for one year</option>
            <option value="I’d hold for up to two years">I’d hold for up to two years</option>
            <option value="I’d hold for more than two years.">I’d hold for more than two years.</option>
          </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Reaction to Market Decline</label>
          <select className="form-select" ref={reactionToDeclineRef} defaultValue={formData.reactionToDecline} required>
            <option value="Cut losses immediately and liquidate all investments. Capital preservation is paramount.">
              Cut losses immediately and liquidate all investments. Capital preservation is paramount.
            </option>
            <option value="Cut your losses and transfer investments to safer asset classes.">
              Cut your losses and transfer investments to safer asset classes.
            </option>
            <option value="You would be worried, but would give your investments a little more time.">
              You would be worried, but would give your investments a little more time.
            </option>
            <option value="You are ok with volatility and accept decline in portfolio value as a part of investing. You would keep your investments as they are">
              You are ok with volatility and accept decline in portfolio value as a part of investing. You would keep your investments as they are
            </option>
            <option value="You would add to your investments to bring the average buying price lower. You are confident about your investments and are not perturbed by notional losses.">
              You would add to your investments to bring the average buying price lower. You are confident about your investments and are not perturbed by notional losses.
            </option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Risk Profile"}
        </button>
      </div>
    </form>
  );
};

export default ClientRiskProfile;
