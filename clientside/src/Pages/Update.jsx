import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Update = () => {
  const { id } = useParams();
  const [token] = useState(localStorage.getItem('token'));
  const [values, setValues] = useState({
    name: "",
    price: "",
    quantity: "",
    expiryDate: "",
    gstApplicable: false, // Use gstApplicable consistently
    discount: "10"
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/getmedicine/${id}`, { headers: { token } })
      .then((res) => {
        setValues({
          ...values,
          name: res.data.name,
          price: res.data.price,
          quantity: res.data.quantity,
          expiryDate: res.data.expiryDate,
          gstApplicable: res.data.gstApplicable,
        });
      })
      .catch((err) => {
        console.error("Error fetching medicine:", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate price with GST if gstApplicable is true
    const priceWithGST = values.gstApplicable ? values.price * 1.18 : values.price;

    axios.put(`http://localhost:3000/api/updateMedicine/${id}`, { ...values, price: priceWithGST }, { headers: { token } })
      .then((res) => {
        console.log(res.data);
        window.location.replace("/admin");
      })
      .catch((err) => {
        console.error("Error updating medicine:", err);
      });
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Update</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Medicine Name"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="price"
              value={values.price}
              onChange={(e) => setValues({ ...values, price: e.target.value })}
              placeholder="Price"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="quantity"
              value={values.quantity}
              onChange={(e) => setValues({ ...values, quantity: e.target.value })}
              placeholder="Quantity"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={values.expiryDate}
              onChange={(e) => setValues({ ...values, expiryDate: e.target.value })}
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div>
              <label className="text-sm font-semibold">GST Applicable</label>
              <input
                type="checkbox"
                name="gstApplicable"
                checked={values.gstApplicable}
                onChange={(e) => setValues({ ...values, gstApplicable: e.target.checked })}
                className="p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
