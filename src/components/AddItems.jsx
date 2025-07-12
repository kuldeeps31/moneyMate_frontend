import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus, FiList, FiSearch, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const AddItem = () => {
  const [itemName, setItemName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/items`);
       

      setItems(res.data.items || []);
    } catch (err) {
      toast.error("Failed to load items");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      toast.error("Item name is required");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
          `${apiBaseUrl}/api/items/add`,
        
        { name: itemName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Item added successfully");
      setItemName("");
      fetchItems();
      setShowAddForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const itemToDelete = items.find(item => item._id === id);
    
    Swal.fire({
      title: 'Delete Item?',
      text: `Are you sure you want to delete "${itemToDelete.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete( `${apiBaseUrl}/api/items/${id}`  , {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success('Item deleted successfully');
          fetchItems();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete item');
        }
      }
    });
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>Inventory Management</h1>
        <p>Add and manage your product items</p>
      </header>

      <div className="content">
        {/* Add Item Section */}
        <section className="card">
          <div className="card-header">
            <FiPlus />
            <h2>Add New Item</h2>
          </div>
          
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pattal, Dona, Plate"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)}>
                  <FiX /> Cancel
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : <><FiPlus /> Add Item</>}
                </button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowAddForm(true)}
              className="add-button"
            >
              <FiPlus /> Add New Item
            </button>
          )}
        </section>

        {/* Item List Section */}
        <section className="card">
          <div className="card-header">
            <FiList />
            <h2>Item Inventory</h2>
          </div>
          
          <div className="search-container">
            <FiSearch />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-container">
            {filteredItems.length > 0 ? (
              <table className="item-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="delete-btn"
                          aria-label="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                {searchTerm ? (
                  <p>No items found matching "{searchTerm}"</p>
                ) : (
                  <p>No items available. Add your first item!</p>
                )}
              </div>
            )}
          </div>

          {filteredItems.length > 0 && (
            <div className="table-footer">
              Showing {filteredItems.length} of {items.length} items
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        /* Base Styles */
        .container {
          max-width: 100%;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }

        /* Header */
        .header {
          margin-bottom: 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 8px;
          color: #2c3e50;
        }
        .header p {
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        /* Layout */
        .content {
          display: grid;
          gap: 25px;
        }

        @media (min-width: 768px) {
          .content {
            grid-template-columns: 1fr 2fr;
          }
        }

        /* Cards */
        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          padding: 20px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .card-header h2 {
          font-size: 1.2rem <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
          </head>
          <body>
            
          </body>
          </html>;
          font-weight: 600;
        }
        .card-header svg {
          font-size: 20px;
        }

        /* Add Item Form */
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-size: 1.1rem !important;
          color: #555;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1.1rem !important;
        }
        .form-group input:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        /* Buttons */
        button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 15px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .add-button {
          background: #3498db;
          color: white;
          width: 100%;
          justify-content: center;
          padding: 10px;
        }
        .add-button:hover {
          background: #2980b9;
        }

        button[type="submit"] {
          background: #2ecc71;
          color: white;
          flex: 1;
        }
        button[type="submit"]:hover {
          background: #27ae60;
        }
        button[type="submit"]:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        button[type="button"] {
          background: #f1f1f1;
          color: #333;
          flex: 1;
        }
        button[type="button"]:hover {
          background: #e0e0e0;
        }

        .delete-btn {
          color: #e74c3c;
          background: none;
          padding: 5px;
        }
        .delete-btn:hover {
          color: #c0392b;
          background: #f9f9f9;
        }

        /* Search */
        .search-container {
          position: relative;
          margin-bottom: 20px;
        }
        .search-container svg {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #95a5a6;
        }
        .search-container input {
          width: 100%;
          padding: 10px 10px 10px 35px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1.1rem;
        }
        .search-container input:focus {
          outline: none;
          border-color: #3498db;
        }

        /* Table */
        .table-container {
          overflow-x: auto;
        }

        .item-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 1.1rem;
          text-transform:capitalize
        }
        .item-table th, .item-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .item-table th {
          font-weight: 600;
          color: #2c3e50;
          background: #f8f9fa;
        }
        .item-table tr:hover td {
          background: #f8f9fa;
        }

        /* Empty State */
        .empty-state {
          padding: 30px;
          text-align: center;
          color: #7f8c8d;
          font-size: 14px;
        }

        /* Table Footer */
        .table-footer {
          margin-top: 15px;
          font-size: 1 rem;
          color: #7f8c8d;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default AddItem;