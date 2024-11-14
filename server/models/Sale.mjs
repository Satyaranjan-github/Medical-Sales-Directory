import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    medicine:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "medicineSchema",  
        required: true
    },
    
    quantity:{
        type: Number,
        required: true,
        min: 1
    },
    saleDate:{
        type: Date,
        required: true
    },
    totalAmount:{
        type: Number,
        required: true  
    }
})


const Sale = mongoose.models.Sale || mongoose.model('sale', saleSchema);

export default Sale
