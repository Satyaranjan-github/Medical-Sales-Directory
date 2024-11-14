import express from "express";
import {getAllMedicine,addSale,getDailySalesReport,monthlySalesReport} from "../controllers/operatorController.mjs"
// import {getDailySalesReport} from "../controllers/reportController.mjs"


const router = express.Router();

// correct
router.get("/getAllMedicine",getAllMedicine)

// correct
router.post("/addsale",addSale)

// correct
router.get("/dailysalesreport",getDailySalesReport)

// correct
router.get("/monthlysalesreport",monthlySalesReport)

export default router;