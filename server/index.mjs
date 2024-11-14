import express from "express";
import admin from "./router/adminRoutes.mjs";
import operator from "./router/operatorRoutes.mjs";
import auth from "./router/authRoutes.mjs";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/medicine")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

app.use(cors());
app.use(express.json());


app.use("/api", admin);

app.use("/api", operator);

app.use("/api", auth);


app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
})
