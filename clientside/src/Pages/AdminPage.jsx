import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPage = () => {

   
   const [token,setToken]=useState(localStorage.getItem('token'));
   const [medicines, setMedicines] = useState([]);
   const [newMedicine, setNewMedicine] = useState({
      name: '',
      price: '',
      quantity: '',
      expiryDate: '',
      gstApplicable: false,
      discount: '10'
   });

   useEffect(() => {
      fetchMedicines();
   }, []);

   const fetchMedicines = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getAllMedicinee",{headers:{token}});
        
        const data = await response.json();
        setMedicines(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

   const addMedicine = async () => {
      if (!newMedicine.name || !newMedicine.price || !newMedicine.quantity || !newMedicine.expiryDate ) {
         alert('Please fill in all fields.');
         return;
      }

      //Apply GST
      const priceWithGST = newMedicine.gstApplicable ? newMedicine.price * 1.18 : newMedicine.price;


      try {
         const response = await axios.post('http://localhost:3000/api/addmedicine',{...newMedicine,price:priceWithGST},{headers:{token}});
         const data = await response.json();
         console.log(data)
      } catch (error) {
         console.error('Error adding medicine:', error);
      }
   };

   const deleteMedicine = async (id) => {
      if (confirmation) {
         try {
            const response = await fetch(`http://localhost:3000/api/deleteMedicine/${id}`,{
               method:'DELETE',
               headers:{token}});
            const data = await response.json();
            console.log(data);
               window.location.replace("/admin");
               alert('Medicine deleted successfully!');
               fetchMedicines(); // Refresh the medicine list
               
         } catch (error) {
            console.error('Error deleting medicine:', error);
         }
      }
   };


   

   return token ? (
      <div className="min-h-screen bg-gray-100">
         <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold text-center text-green-600 mb-6">Admin Dashboard</h1>
   
            {/* Add Medicine Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
               <h2 className="text-2xl font-semibold mb-4">Add New Medicine</h2>
               <form onSubmit={addMedicine}>
                  <div className="flex flex-col gap-4">
                     <input
                        type="text"
                        name="name"
                        value={newMedicine.name}
                        onChange={(e) => setNewMedicine((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="Medicine Name"
                        className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                     />
                     <input
                        type="text"
                        name="price"
                        value={newMedicine.price}
                        onChange={(e) => setNewMedicine((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="Price"
                        className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                     />
                     <input
                        type="text"
                        name="quantity"
                        value={newMedicine.quantity}
                        onChange={(e) => setNewMedicine((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="Quantity"
                        className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                     />
                     <label>Expiry Date</label>
                     <input
                        type="date"
                        name="expiryDate"
                        value={newMedicine.expiryDate}
                        onChange={(e) => setNewMedicine((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                     />
                     <div>
                        <label className="text-sm font-semibold">GST Applicable</label>
                        <input
                           type="checkbox"
                           name="gstApplicable"
                           checked={newMedicine.gstApplicable}
                           onChange={(e) =>
                              setNewMedicine((prev) => ({ ...prev, [e.target.name]: e.target.checked }))
                           }
                           className="p-2"
                        />
                     </div>
                     <button
                        type="submit"
                        className="w-full mt-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
                     >
                        Add Medicine
                     </button>
                  </div>
               </form>
            </div>
   
            {/* Medicine List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="text-2xl font-semibold mb-4">Medicine List</h2>
               {medicines.length === 0 ? (
                  <p>No medicines available</p>
               ) : (
                  <table className="min-w-full table-auto">
                     <thead>
                        <tr>
                           <th className="px-4 py-2 text-left">Name</th>
                           <th className="px-4 py-2 text-left">Price</th>
                           <th className="px-4 py-2 text-left">Quantity</th>
                           <th className="px-4 py-2 text-left">Expiry Date</th>
                           <th className="px-4 py-2 text-left">GST</th>
                           <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {medicines.map((medicine) => (
                           <tr key={medicine._id}>
                              <td className="px-4 py-2">{medicine.name}</td>
                              <td className="px-4 py-2">{medicine.price}</td>
                              <td className="px-4 py-2">{medicine.quantity}</td>
                              <td className="px-4 py-2">{medicine.expiryDate}</td>
                              <td className="px-4 py-2">{medicine.gstApplicable ? "18%" : 'N/A'}</td>
                              <td className="px-4 py-2 flex gap-2">
                                 <button
                                    onClick={() => deleteMedicine(medicine._id)}
                                    className="text-red-600 hover:text-red-800 border  border-black p-1 rounded"
                                 >
                                    Delete
                                 </button>
                                 <Link to={`/update/${medicine._id}`}>
                                 <button
                                    onClick={() => deleteMedicine(medicine._id)}
                                    className="text-red-600 hover:text-red-800 border  border-black p-1 rounded"
                                 >
                                    Update
                                 </button>
                                 </Link>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
         </div>
      </div>
   ) : (
      <h2 className="text-4xl font-serif font-bold text-gray-600">Please Login First</h2>
   );
   
}
export default AdminPage;
