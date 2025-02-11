import React, { useState, useEffect } from "react";
import SalesReport from "../components/Salesreport";
import axios from "axios";

const OperatorPage = () => {
  const [query, setQuery] = useState("");
  const [newData, setNewData] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2024);
  const [date, setDate] = useState(11);
  const [medicines, setMedicines] = useState([]);
  const [saleData, setSaleData] = useState({
    medicineId: "",
    quantity: "",
    totalAmount: "",
    saleDate: "",
  });
  const [dailySalesReport, setDailySalesReport] = useState([]);
  const [monthlySalesReport, setMonthlySalesReport] = useState([]);

  // Fetch all medicines
  const fetchMedicines = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/getAllMedicinee",
        { headers: { token } }
      );

      const data = await response.json();
      setMedicines(data);
      console.log("medicine data", data);

      const transform = data?.reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {});


      setNewData(transform);
     
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  // useEffect to fetch medicines
  useEffect(() => {
    fetchMedicines();
  }, []);

  // console.log("newdata2:",newData2[saleData.medicineId].expiryDate)
  console.log("New Data:", newData);

  useEffect(() => {
    setSaleData({
      ...saleData,
      totalAmount: newData[saleData.medicineId]?.price * saleData.quantity ,
    });
  }, [saleData.quantity]);


// Expiry date Adding
  const expiryData = newData[saleData.medicineId]?.expiryDate;
  console.log("Expiry date:", expiryData);

  // Add sale
  const addSale = async (e) => {
    e.preventDefault();

    if (
      !saleData.medicineId ||
      !saleData.quantity ||
      !saleData.totalAmount ||
      !saleData.saleDate
    ) {
      alert("Please fill in all fields.");
      return;
  }

    try {
      if (
        saleData.quantity >
        medicines.find((medicine) => medicine._id === saleData.medicineId)
          .quantity
      ) {
        alert("Quantity not available");
        alert(
          "Quantity availabel:" +
            medicines.find((medicine) => medicine._id === saleData.medicineId)
              .quantity
        );
        return;
      }

      // expirydate will display here
      const expiryDate = new Date(
        medicines.find((medicine) => medicine._id === saleData.medicineId).expiryDate
      );
      const saleDate = new Date(saleData.saleDate);
      
      // Ensure both dates are in the same format by comparing only the date portion (YYYY-MM-DD)
      const daysBeforeExpiry = Math.ceil(
        (expiryDate.setHours(0, 0, 0, 0) - saleDate.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
      );
      
      if (daysBeforeExpiry <= 3 && daysBeforeExpiry > 0) {
        alert("Medicine is to be expired");
      } else if (daysBeforeExpiry === 0) {
        alert("Medicine is expiring today");
        return;
      } else if (daysBeforeExpiry < 0) {
        alert("Medicine is expired already and cannot be sold");
        return;
      }
      

      const response = await axios.post("http://localhost:3000/api/addsale", {
        medicineId: saleData.medicineId,
        quantity: saleData.quantity,
        totalAmount: saleData.totalAmount,
        saleDate: saleData.saleDate || new Date().toISOString(),
      });

      console.log(response.data);
      // const data = await response.data;
      // console.log(data);
      alert("Sale added successfully!");
      window.location.reload("/operatorpage");
      setSaleData({
        medicineId: "",
        quantity: "",
        totalAmount: "",
        saleDate: "",
      });
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  const handleChangeAmount = (e) => {
    setSaleData({ ...saleData, quantity: e.target.value });
  };

  // Fetch daily sales report
  const fetchDailySalesReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/dailysalesreport?date=${date}`
      );
      const data = await response.json();
      setDailySalesReport(data);
      console.log("Daily Sales Report:", dailySalesReport);
      console.log(data);
    } catch (error) {
      console.error("Error fetching daily sales report:", error);
    }
  };

  // Fetch monthly sales report
  const fetchMonthlySalesReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/monthlysalesreport?month=${month}&year=${year}`
      );
      const data = await response.json();
      setMonthlySalesReport(data);
      console.log(monthlySalesReport);
      console.log(data);
    } catch (error) {
      console.error("Error fetching monthly sales report:", error);
    }
  };

  return token ? (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-6">
          Operator Dashboard
        </h1>

        {/* Sale Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add Sale</h2>
          <div className="flex flex-col gap-4">
            <select
              name="medicineId"
              value={saleData.medicineId}
              onChange={(e) =>
                setSaleData({ ...saleData, medicineId: e.target.value })
              }
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Medicine</option>
              {medicines &&
                medicines.length > 0 &&
                medicines.map((medicine) => (
                  <option key={medicine._id} value={medicine._id}>
                    {medicine.name}
                  </option>
                ))}
            </select>
            <input
              type="number"
              name="quantity"
              value={saleData.quantity}
              onChange={handleChangeAmount}
              placeholder="Quantity Sold"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              name="totalAmount"
              value={saleData.totalAmount}
              readOnly
              placeholder="Total Amount"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              value={new Date(expiryData).toLocaleDateString('en-CA')}
              readOnly
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="date"
              name="saleDate"
              value={saleData.saleDate}
              onChange={(e) =>
                setSaleData({ ...saleData, saleDate: e.target.value })
              }
              placeholder="Sale Date"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={addSale}
              className="w-full mt-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
            >
              Add Sale
            </button>
          </div>
        </div>

        {/* fetch medicines */}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Medicine List</h2>
          <input
            type="text"
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Search Medicine"
          />
          {medicines.length === 0 ? (
            <p>No medicines available</p>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Price per unit</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Expiry Date</th>
                  <th className="px-4 py-2 text-left">GST</th>
                </tr>
              </thead>
              <tbody>
                { medicines.filter((medicine) =>
        medicine.name.toUpperCase().includes(query)
      ).map((medicine) => (
                  <tr key={medicine._id}>
                    <td className="px-4 py-2">{medicine.name}</td>
                    <td className="px-4 py-2">{medicine.price}</td>
                    <td className="px-4 py-2">{medicine.quantity}</td>
                    <td className="px-4 py-2">{ new Date(medicine.expiryDate).toLocaleDateString('en-CA')}</td>
                    <td className="px-4 py-2">
                      {medicine.gstApplicable ? `18%` : "N/A"}
                    </td>

                    <td className="px-4 py-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Daily Sales Report */}
        <div class="flex  items-center justify-center min-h-screen bg-gray-100">
          <form
            onSubmit={fetchDailySalesReport}
            class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 class="text-2xl font-bold mb-4 text-gray-800 text-center">
              Daily Sales Report
            </h2>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-semibold mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter month"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out"
            >
              Submit
            </button>
          </form>

          <div class="mt-8 w-full max-w-2xl">
            <SalesReport salesData={dailySalesReport} />
          </div>
        </div>

        {/* Monthly Sales Report */}

        <div class="flex items-center justify-center min-h-screen bg-gray-100">
          <form
            onSubmit={fetchMonthlySalesReport}
            class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 class="text-2xl font-bold mb-4 text-gray-800 text-center">
              Monthly Sales Report
            </h2>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-semibold mb-2">
                Month
              </label>
              <input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter month"
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-semibold mb-2">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter year"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out"
            >
              Submit
            </button>
          </form>

          <div class="mt-8 w-full max-w-2xl">
            <SalesReport salesData={monthlySalesReport} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>Please login to access the operator dashboard.</p>
  );
};

export default OperatorPage;
