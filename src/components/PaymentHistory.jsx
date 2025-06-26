import React, { useState } from "react";
import "../styles/paymentHistory.css";

const sampleData = [
  {
    date: "2024-06-01",
    name: "Ramesh",
    phone: "9876543210",
    paid: 300,
    remaining: 700,
    nextDate: "2024-06-20",
  },
  {
    date: "2024-06-03",
    name: "Suresh",
    phone: "9123456780",
    paid: 500,
    remaining: 200,
    nextDate: "2024-06-15",
  },
];

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
