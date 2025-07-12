import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPhone, FiHome, FiDollarSign, FiClock, FiChevronRight } from "react-icons/fi";
import "../styles/CustomerDetails.css";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const CustomerDetail = () => {
  const { id } = useParams();
  console.log("CustomerDetail mounted, id =", id);
  const navigate = useNavigate();


  const [customer, setCustomer] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

const toggleExpand = (idx) => {
  setExpandedRow(expandedRow === idx ? null : idx);
};


  useEffect(() => {
    const fetchCustomer = async () => {
        console.log("About to fetch /api/payment/customer/" + id);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
        `${apiBaseUrl}/api/payment/customer/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomer(res.data.customer);
        setPayments(res.data.payments);
        console.log( ".....",  res.data.customer);
        console.log("✅ Fetched payments:", res.data.payments.length, res.data.payments)
      } catch (err) {
        console.error("Failed to fetch customer:", err);
        alert("❌ Customer not found");
        navigate("/dashboard/viewCustomers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>No customer data found.</div>;

  const totalPaid = customer.totalPaid || 0;
  const totalRemaining = customer.remainingAmount || 0;
  const paymentComplete = totalRemaining <= 0;



  //to handle customer history

  const handleExportCustomerHistory = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${apiBaseUrl}/api/export/customer/${customer._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Export failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${customer.name}-history.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("❌ Failed to export customer history.");
    console.error(err);
  }
};


  return (
    <div className="customer-detail-container">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiChevronRight className="btn-icon" /> Back
        </button>
        <h2>Customer Details</h2>
      </div>
    {/*<button 
  onClick={handleExportCustomerHistory}
  className="export-btn"
>
  <i class="fas fa-file-export"></i>
  Export History
</button>*/}
<button 
  onClick={handleExportCustomerHistory}
  className="export-all-btn"
  title="Export All Customers Data"
>
  <i className="fas fa-file-export"></i>
  <span> Export History</span>
</button>
      <div className="customer-profile">
        <div className="profile-header">
          <div className="avatar">{customer.name?.charAt(0)}</div>
          <div className="profile-info">
            <h3>{customer.name}</h3>
            <p className="customer-id">ID: {customer.phone?.slice(-6)}</p>
          </div>
          <div className={`status-badge ${paymentComplete ? 'complete' : 'pending'}`}>
            {paymentComplete ? 'Payment Complete' : 'Payment Pending'}
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <FiPhone className="info-icon" />
            <div>
              <p className="info-label">Phone</p>
              <p className="info-value">{customer.phone}</p>
            </div>
          </div>

          <div className="info-card">
            <FiHome className="info-icon" />
            <div>
              <p className="info-label">Address</p>
              <p className="info-value">{customer.address}</p>
            </div>
          </div>

          <div className="info-card">
            <FiDollarSign className="info-icon" />
            <div>
              <p className="info-label">Total Amount</p>
              <p className="info-value">₹{(customer.totalAmount || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="info-card">
            <FiDollarSign className="info-icon" />
            <div>
              <p className="info-label">Total Paid</p>
              <p className="info-value success">₹{totalPaid.toLocaleString()}</p>
            </div>
          </div>

          <div className="info-card">
            <FiDollarSign className="info-icon" />
            <div>
              <p className="info-label">Remaining</p>
              <p className={`info-value ${paymentComplete ? 'success' : 'danger'}`}>₹{totalRemaining.toLocaleString()}</p>
            </div>
          </div>

          <div className="info-card">
            <FiClock className="info-icon" />
            <div>
              <p className="info-label">Last Payment</p>
              <p className="info-value">
                {customer.lastPaymentDate
                  ? new Date(customer.lastPaymentDate).toLocaleDateString()
                  : 'No payments'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h3>Payment History</h3>
        <p>{payments.length} transactions</p>
      </div>

      <div className="payment-history">
        {payments.length > 0 ? (
          <>
            <div className="history-table">
              <div className="table-header">
                <div>Date</div>
                <div>Paid Amount</div>
                   <div>Items Purchased</div> 
                {/*<div>Remaining</div>*/}
                <div>Status</div>
              </div>
              {payments.map((entry, idx) => (
                <div className="table-row" key={idx}>
                  <div>{new Date(entry.paymentDate).toLocaleDateString()}</div>
                  <div className="amount">₹{entry.amountPaid.toLocaleString()}</div>
                  {/*<div className="amount">₹{entry.remainingAmount.toLocaleString()}</div>*/}
                    {/*<div className="amount">
      ₹{(entry.totalAmount && entry.amountPaid)
        ? (entry.totalAmount - entry.amountPaid).toLocaleString()
        : "N/A"}  
    </div>*/}
                {/*//for items*/}
                
                      <div className="items-column">
      {entry.items?.length > 0 ? (
        <>
          <div className="items-list">
            {entry.items.slice(0, 2).map((item, i) => (
              <span key={i} className="item-tag">
                {item.name} ({item.quantity})
              </span>
            ))}
            {entry.items.length > 2 && (
              <button 
                onClick={() => toggleExpand(idx)}
                className="more-items-btn"
              >
                +{entry.items.length - 2} more
              </button>
            )}
          </div>
          
          {/* Expanded Items (when clicked) */}
          {expandedRow === idx && (
            <div className="expanded-items">
              {entry.items.slice(2).map((item, i) => (
                <div key={i} className="full-item">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  {item.price && <span>₹{item.price}</span>}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <span className="no-items">No items</span>
      )}
    </div>


                  <div>
                    <span className={`payment-status ${idx === payments.length - 1 && entry.remainingAmount > 0 ? 'pending' : 'completed'}`}>
                      {idx === payments.length - 1 && entry.remainingAmount > 0 ? 'Pending' : 'Completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="payment-summary">
              <div className="summary-item">
                <p>Total Paid</p>
                <p className="amount" style={{color:'green'}}>₹{totalPaid.toLocaleString()}</p>
              </div>
              <div className="summary-item">
                <p>Remaining Balance</p>
                <p className={`amount ${paymentComplete ? 'success' : 'danger'}`}>₹{totalRemaining.toLocaleString()}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>No payment history available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
