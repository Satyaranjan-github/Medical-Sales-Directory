import medicineData from "../models/Medicine.mjs"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/User.mjs';


// Add a new Medicine
export const addmedicine = async(req,res)=>{
   
    console.log(req.body)
    try {
        
        const {name,price,quantity,expiryDate,gstApplicable,discount} = req.body;
        const newMedicine = new medicineData({
            name,
            price,
            quantity,
            expiryDate,
            gstApplicable,
            discount
        });
        
        await newMedicine.save();
        res.status(201).json({
            message:"Medicine Added Successfully",
            medicine:newMedicine
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}

// Update a Medicine
export const updateMedicine = async(req,res)=>{
    try {
        const {id}=req.params
        const {name,price,quantity,expiryDate,gstApplicable,discount}=req.body;

        const updateMedicine = await medicineData.findByIdAndUpdate(
            id,
            {name,price,quantity,expiryDate,gstApplicable,discount},
            {new:true}
        )

        if(!updateMedicine){
            return res.status(404).json({
                error : "Medicine Not Found"
            })
        }

        res.status(200).json({message:"Medicine Updated Successfully",medicine:updateMedicine});


    } catch (error) {
        res.status(500).json({
            error:"Failed to update Medicine"
        })
    }
}

// Delete a Medicine
export const deleteMedicine = async(req,res)=>{
    try {
        const {id} = req.params;
        console.log(req.params)
   
        const medicine = await medicineData.findByIdAndDelete(id);

        if(!medicine){
            return res.status(404).json({error:"Medicine Not Found"})
        }

        res.status(200).json({
            message:"Medicine Deleted Successfully"
        })
    }  
    catch (error) {
        res.status(500).json({
            error:"Failed to delete Medicine"
        })
    }
} 


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

export const getMedicine = async(req,res)=>{
  try{
    const medicines = await medicineData.findById(req.params.id)
    res.status(200).json(medicines)
  }catch(error){
    res.status(500).json({
        error:"Failed to Fetch medicine"
    })
    if(error){
      console.log(error)
  }
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET); // Optional expiration time
}

export const createUser = async (req, res) => {
  try {
      // Extracting name, email, and password from request body
      const { name, email, password } = req.body;
      
      // Log the request body to ensure it's being sent correctly
      console.log(req.body);

      // Validate that all required fields are provided
      if (!name || !email || !password) {
          return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      // Check if the user already exists in the database
      const exist = await userModel.findOne({ email });
      if (exist) {
          return res.status(400).json({ error: 'User already exists' });
      }

      // Hashing user password
      const saltRounds = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Creating a new user
      const newUser = new userModel({
          name,
          email,
          password: hashedPassword,
      });

      // Saving the new user to the database
      const user = await newUser.save();

      // Generate JWT token for the user
      const token = createToken(user._id);

      // Responding with the token and success message
      res.status(201).json({
          success: true,
          token,
          message: 'User created successfully',
      });
  } catch (error) {
      // Log error with more context
      console.error('Error creating user:', error.message);

      // Return a general error response
      res.status(500).json({ error: 'Internal server error' });
  }
};


  export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if(isMatch ){
        const token = createToken(user._id);

        res.status(200).json({ 
          success: true,
          token,
          message: 'Login successful' });
      }else{
        return res.status(400).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };