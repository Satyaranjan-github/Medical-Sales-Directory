import Sale from "../models/sale.mjs";


// Get All Medicine 
export const getAllMedicine = async(req,res)=>{
    try {
      const medicines = await medicineData.find()
      res.status(200).json(medicines)
      
    } catch (error) {
      res.status(500).json({
          error:"Failed to Fetch medicine"
      })
    }    
  }


//   Add a Medicine to Sale 
export const addSale = async (req, res) => {
    try {
        const { medicineId, quantity, saleDate, totalAmount } = req.body;
    
        // Validate required fields
        if (!medicineId || !quantity || !saleDate || !totalAmount) {
            return res.status(400).json({ error: "Invalid Input Data" });
        }
    

        // Check if the medicine exists
        const medicine = await medicineData.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
    
        const medicineName = await medicineData.findById(medicineId).select('name');
        console.log(medicineName)

        // Create a new sale document
        let sales = new Sale({
            medicine: medicineId,
            quantity,
            saleDate: saleDate || Date.now(), // Defaults to current date if saleDate is not provided
            totalAmount
        });
    
        // Save the sale document
        await sales.save();
    
        await medicineData.findByIdAndUpdate(medicineId,{
            $inc: {quantity: -quantity}
        },{new:true,runValidators:true})

        // Populate the medicine field to get the name
        sales = await sales.populate('medicine', 'name');
    
        // Send response with the saved sale, now including the medicine name
        res.status(201).json({ message: 'Medicine added to sale', sales, medicineName: medicineName.name });
    }  catch (error) {
        console.log("Error in adding:", error);
        
        res.status(500).json({
            error: "Failed to add medicine to sale"
        });
    }
};



import medicineData from "../models/Medicine.mjs";  // Assuming you have a Medicine model to fetch medicine details

export const getDailySalesReport = async (req, res) => {
    try {
        const {date} = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date is required for daily sales report' });
        }

        const startDate = new Date(date);
        const endDate = new Date(date);

        // Add one day to the end date
        endDate.setDate(endDate.getDate() + 1);

        const sales = await Sale.find({
            saleDate: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('medicine', 'name cost');

        res.status(200).json(sales);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to generate daily sales report',
            details: error.message,
        });
    }
};



// Generate monthly sales Report 
export const monthlySalesReport = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required for monthly sales report' });
        }

        // Convert month and year to a date range
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Get all sales within the specified month
        const sales = await Sale.find({
            saleDate: {
                $gte: startDate,  
                $lte: endDate
            }
        }).populate('medicine', 'name cost');

        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate monthly sales report' });
    }
};