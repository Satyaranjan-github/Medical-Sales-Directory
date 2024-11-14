import express from "express";
import authUser from "../middleware/auth.mjs";
import cors from "cors";
import {addmedicine , updateMedicine , deleteMedicine , getAllMedicine, createUser , loginUser , getMedicine} from "../controllers/adminController.mjs"


const router = express.Router();

router.use(cors());


// correct 
router.post("/addmedicine",authUser,addmedicine);

// correct
router.put("/updateMedicine/:id",authUser,updateMedicine)

// correct
router.delete("/deleteMedicine/:id",authUser,deleteMedicine)

// correct
router.get("/getAllMedicinee",authUser,getAllMedicine)  

// correct
router.post("/register",createUser)

//correct
router.post("/login",loginUser)


router.get("/getMedicine/:id",getMedicine)

export default router;


