import React from 'react'

const SalesReport = ({ salesData }) => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Sales Report</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {salesData.length === 0 ? (
              <p className="text-center text-gray-500">No sales data available</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-100 text-gray-800">
                    <th className="border-b p-4 text-left font-semibold">Medicine</th>
                    <th className="border-b p-4 text-left font-semibold">Quantity Sold</th>
                    <th className="border-b p-4 text-left font-semibold">Sale Date</th>
                    <th className="border-b p-4 text-left font-semibold">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((sale, index) => (
                    <tr 
                      key={sale._id} 
                      className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50 transition`}
                    >
                      <td className="p-4 border-b">
                        {sale.medicine ? sale.medicine.name : 'Unknown Medicine'}
                      </td>
                      <td className="p-4 border-b">{sale.quantity}</td>
                      <td className="p-4 border-b">
                        {new Date(sale.saleDate).toLocaleString()}
                      </td>
                      <td className="p-4 border-b font-medium text-indigo-700">${sale.totalAmount*sale.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-indigo-100 text-gray-800">
                    <th className="border-b p-4 text-left font-semibold">Total</th>
                    <th className="border-b p-4 text-left font-semibold">{salesData.reduce((total, sale) => total + sale.quantity, 0)}</th>
                    <th className="border-b p-4 text-left font-semibold">-</th>
                    <th className="border-b p-4 text-left font-semibold">${salesData.reduce((total, sale) => total + sale.totalAmount*sale.quantity, 0)}</th>
                  </tr>
                </tfoot>
              </table>
              
            )}
          </div>
        </div>
      </div>
    );
  };

export default SalesReport
