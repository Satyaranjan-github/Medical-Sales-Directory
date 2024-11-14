import Sale from '../models/sale.mjs';  // Correct import for Sale model

export const getDailySalesReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date is required for daily sales report' });
        }

        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const sales = await Sale.find({
            saleDate: { $gte: startDate, $lt: endDate }
        }).populate('Medicine', 'name cost');  // Correctly populate medicine field

        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate daily sales report' });
    }
};

// Generate a monthly sales report
export const getMonthlySalesReport = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required for monthly sales report' });
        }

        // Set up date range for the given month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of the month

        // Find sales within the specified month and populate medicine details
        const sales = await sale.find({
            saleDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('medicine', 'name cost');

        // Summarize sales data
        const totalSales = sales.reduce((sum, sale) => sum + (sale.quantity * sale.medicine.cost), 0);

        res.status(200).json({
            month,
            year,
            totalSales,
            sales
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate monthly sales report' });
    }
};

// Generate a summary report with total sales and top-selling medicines
export const getSalesSummaryReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required for sales summary report' });
        }

        // Convert dates to appropriate format
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1); // Include end date in the range

        // Find all sales within the date range
        const sales = await sale.find({
            saleDate: {
                $gte: start,
                $lt: end
            }
        }).populate('medicine', 'name cost');

        // Calculate total sales and top-selling medicines
        let totalSales = 0;
        const medicineSales = {};

        sales.forEach(sale => {
            const saleAmount = sale.quantity * sale.medicine.cost;
            totalSales += saleAmount;

            if (medicineSales[sale.medicine.name]) {
                medicineSales[sale.medicine.name].quantity += sale.quantity;
                medicineSales[sale.medicine.name].total += saleAmount;
            } else {
                medicineSales[sale.medicine.name] = {
                    quantity: sale.quantity,
                    total: saleAmount
                };
            }
        });

        // Sort medicines by total sales amount
        const topSellingMedicines = Object.entries(medicineSales)
            .sort((a, b) => b[1].total - a[1].total)
            .map(([name, data]) => ({ name, ...data }));

        res.status(200).json({
            startDate,
            endDate,
            totalSales,
            topSellingMedicines
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate sales summary report' });
    }
};
