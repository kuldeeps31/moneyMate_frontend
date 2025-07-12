import React, { useState } from "react";
import "../styles/EditBill.css";
const apiBaseUrl = import.meta.env.VITE_API_URL;

function EditBill({ bill, onClose, onUpdate }) {
  const [form, setForm] = useState({
    amountPaid: bill.amountPaid,
    items: bill.items,
  });

  const token = localStorage.getItem("token");

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    newItems[index].totalPrice = newItems[index].quantity * newItems[index].pricePerUnit;
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async () => {
    const isInvalid = form.items.some(
      (item) => !item.name || item.quantity <= 0 || item.pricePerUnit < 0
    );
    if (isInvalid) {
      alert("Please fill all item fields correctly");
      return;
    }

    try {
      //const res = await fetch(`http://localhost:8080/api/payment/${bill._id}`, {
      //  method: "PUT",
      //  headers: {
      //    "Content-Type": "application/json",
      //    Authorization: `Bearer ${token}`
      //  },
      //  body: JSON.stringify({
      //    ...form,
      //    amountPaid: +form.amountPaid
      //  })
      //});

      //const data = await res.json();
      //alert(data.message);
      //onUpdate();


      const res = await fetch(`${apiBaseUrl}/api/payment/${bill._id}`    , {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    ...form,
    amountPaid: +form.amountPaid,
  }),
});

const data = await res.json();

if (!res.ok) {
  // Handle failure case (like bill already sent)
  alert(data.message || "Failed to update bill");
  return;
}

// ✅ Success
alert("Bill updated successfully");
onUpdate();

    } catch (err) {
      console.error("Error updating bill:", err);
    }
  };

  return (
    <div className="edit-bill-overlay">
      <div className="edit-bill-modal">
        <div className="edit-bill-header">
          <h3>Edit Bill</h3>
          <h4>{bill.customerName}</h4>
        </div>

        <div className="edit-bill-content">
          <div className="form-group">
            <label>Amount Paid (₹)</label>
            <input
              type="number"
              value={form.amountPaid}
              onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>

          <div className="items-section">
            <h4>Items</h4>
            <div className="items-header">
              <span>Item Name</span>
              <span>Qty</span>
              <span>Price/Unit</span>
              <span>Total</span>
            </div>
            
            {form.items.map((item, i) => (
              <div className="item-row" key={i}>
                <input 
                  value={item.name} 
                  readOnly 
                  className="item-name"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(i, "quantity", +e.target.value)}
                  className="item-quantity"
                />
                <input
                  type="number"
                  min="0"
                  value={item.pricePerUnit}
                  onChange={(e) => handleItemChange(i, "pricePerUnit", +e.target.value)}
                  step="0.01"
                  className="item-price"
                />
                <span className="item-total">₹{item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="edit-bill-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditBill;