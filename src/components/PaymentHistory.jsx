import React, { useState } from "react";
import "../styles/paymentHistory.css";
const apiBaseUrl = import.meta.env.VITE_API_URL;



const PaymentHistory = () => {
  const [filteredData, setFilteredData] = useState(sampleData);
  const [customerFilter, setCustomerFilter] = useState("");

  const handleFilter = () => {
    if (customerFilter === "") {
      setFilteredData(sampleData);
    } else {
      const result = sampleData.filter((item) =>
        item.name.toLowerCase().includes(customerFilter.toLowerCase())
      );
      setFilteredData(result);
    }
  };

  const totalPaid = filteredData.reduce((sum, item) => sum + item.paid, 0);
  const totalRemaining = filteredData.reduce((sum, item) => sum + item.remaining, 0);

  return (
    <div className="history-container">
      <h2>📈 Payment History</h2>

      <div className="filter-box">
        <input
          type="text"
          placeholder="Filter by Customer Name"
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
        />
        <button onClick={handleFilter}>Apply Filter</button>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Paid</th>
            <th>Remaining</th>
            <th>Next Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.name}</td>
              <td>{entry.phone}</td>
              <td>₹{entry.paid}</td>
              <td>₹{entry.remaining}</td>
              <td>{entry.nextDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary">
        <p>💰 Total Paid: ₹{totalPaid}</p>
        <p>📉 Total Remaining: ₹{totalRemaining}</p>
      </div>
    </div>
  );
};

export default PaymentHistory;
