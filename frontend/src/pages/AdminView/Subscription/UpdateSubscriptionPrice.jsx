import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateSubscriptionPlan = () => {
  const [planName, setPlanName] = useState("Indian");
  const [priceRupees, setPriceRupees] = useState("");
  const [priceDollar, setPriceDollar] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    const fetchPlanDetails = async () => {
      setFetching(true);
      try {
        const res = await axios.get(`${url}/admin/getPlanByName/${planName}`, {
          withCredentials: true,
        });
        const plan = res.data.plan;
        setPriceRupees(plan.priceRupees || "");
        setPriceDollar(plan.priceDollar || "");
      } catch (error) {
        console.error("Error fetching plan:", error?.response?.data || error.message || error);
        alert("Failed to fetch plan data. See console for details.");
        setPriceRupees("");
        setPriceDollar("");
      } finally {
        setFetching(false);
      }
    };

    fetchPlanDetails();
  }, [planName, url]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!priceRupees) {
      alert("Price in Rupees is required");
      return;
    }
    if (planName.includes("NRI") && !priceDollar) {
      alert("Price in Dollar is required for NRI and NRI Renewal plans");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `${url}/admin/updatePlanByName/${planName}`,
        {
          priceRupees,
          priceDollar: planName.includes("NRI") ? priceDollar : undefined,
        },
        { withCredentials: true }
      );
      alert(`Plan '${planName}' updated successfully!`);
    } catch (error) {
      console.error("Error updating plan:", error?.response?.data || error.message || error);
      alert("Failed to update plan. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow p-4">
        <h2 className="mb-4">Update Subscription Plan Price</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Select Plan</label>
            <div>
              {["Indian", "NRI", "Indian Renewal", "NRI Renewal"].map((plan) => (
                <div className="form-check mb-2" key={plan}>
                  <input
                    type="radio"
                    id={`plan-${plan}`}
                    name="planName"
                    value={plan}
                    checked={planName === plan}
                    onChange={() => setPlanName(plan)}
                    className="form-check-input"
                  />
                  <label htmlFor={`plan-${plan}`} className="form-check-label">
                    {plan}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="priceRupees" className="form-label">
              Price in Rupees
            </label>
            <input
              type="Text"
              id="priceRupees"
              className="form-control"
              value={priceRupees}
              onChange={(e) => setPriceRupees(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          {planName.includes("NRI") && (
            <div className="mb-3">
              <label htmlFor="priceDollar" className="form-label">
                Price in Dollar
              </label>
              <input
                type="Text"
                id="priceDollar"
                className="form-control"
                value={priceDollar}
                onChange={(e) => setPriceDollar(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading || fetching}>
            {loading ? "Updating..." : fetching ? "Loading..." : "Update Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubscriptionPlan;
