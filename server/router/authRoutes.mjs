import express from "express";

const router = express.Router();

router.get("/authrouter", (req, res) => {
    res.send("Hello World! with authrouter router");
});


export default router;