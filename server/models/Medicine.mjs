import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    gstApplicable: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100  // discount as a percentage
    }
});


const  medicineData =new mongoose.model("medicineSchema", medicineSchema);

export default medicineData
