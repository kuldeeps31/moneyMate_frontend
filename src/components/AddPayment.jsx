import React, { useState, useEffect } from "react";
import "../styles/addPayment.css"
import { FiChevronRight } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
const apiBaseUrl = import.meta.env.VITE_API_URL;
import axios from "axios";


import { toast } from "react-toastify";

const AddPayment = () => {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [nextDate, setNextDate] = useState("");
    const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  useEffect(() => {
    if (!customer) {
      alert("Customer not found. Redirecting...");
      navigate("/dashboard/viewCustomers");
    }
  }, [customer, navigate]);


  const handleSubmit = async (e) => {
  e.preventDefault();
    setLoading(true); // 🔁 Start loading

  try {
    const numericAmount = Number(amount);

    if (numericAmount > customer.remainingAmount) {
      alert(`❌ You cannot pay more than ₹${customer.remainingAmount}`);
      return;
    }

    const token = localStorage.getItem("token");

    const body = {
      customerId: customer._id,
      amountPaid: numericAmount,
      paymentDate: paymentDate, // 👈 sending selected date from frontend
    };

    const newRemaining = customer.remainingAmount - numericAmount;

    if (newRemaining > 0) {
      body.nextPaymentDate = nextDate;
    }


    const res = await axios.post(`${apiBaseUrl}/api/payment/update`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updated = res.data?.customer;
    alert(
      `✅ ₹${numericAmount} added successfully!\n\n` +
        `Previous Paid: ₹${customer.paidAmount}\n` +
        `New Paid: ₹${updated.paidAmount}\n` +
        `Remaining: ₹${updated.remainingAmount}\n\n` +
        `Payment Date: ${paymentDate}\n` +
        (updated.remainingAmount > 0 ? `Next Payment Date: ${nextDate}` : "🎉 Payment Complete")
    );

    navigate("/dashboard/viewCustomers");
  } catch (err) {
    console.error("❌ Payment Update Failed", err);
    alert("❌ Payment update failed. Try again.");
  }

  setLoading(false); // 🔚 End loading
};

  if (!customer) return null;


  console.log("i will do it and  is  bsi");
 
  

  return (
    <div className="payment-container">
      <h2>Add New Payment</h2>

      <div className="detail-header">
        <button onClick={() => navigate("/dashboard/viewCustomers")} className="back-btn">
          <FiChevronRight className="btn-icon" /> Back
        </button>
      </div>


      <div className="summary-box">
        <h4>🔁 Last Transaction</h4>
        <p><strong>Customer:</strong> {customer.name}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Last Payment Date:</strong> {new Date(customer.lastPaymentDate).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ₹{customer.totalAmount}</p>
        <p><strong>Paid So Far:</strong> ₹{customer.paidAmount}</p>
        <p><strong>Remaining:</strong> ₹{customer.remainingAmount}</p>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <label>New Payment Amount (₹)</label>
        <input
          type="text"
          value={amount}
          required
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter payment amount"
          //min="1"
          max={customer.remainingAmount}
        />

        <label>Payment Date</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
        />

      {(() => {
  const numericAmount = Number(amount);
  const newRemaining = customer.remainingAmount - numericAmount;

  if (!amount || numericAmount <= 0) return null;

  if (newRemaining <= 0) {
    return (
      <p style={{ color: 'green', marginTop: '1rem' }}>
        🎉 This customer has completed all payments!
      </p>
    );
  }

  return (
    <>
          <label>Next Payment Date</label>
      <input
        type="date"
        value={nextDate}
        onChange={(e) => setNextDate(e.target.value)}
        required={newRemaining > 0}
      />

    </>
  );
})()}

       <button type="submit" disabled={loading}>
  {loading ? (
    <>
      <span className="spinner" /> Processing...
    </>
  ) : (
    "Submit Payment"
  )}
</button>

      </form>


      
    </div>
  );
};

export default AddPayment;
