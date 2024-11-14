import axios from 'axios';
import React, { useEffect, useState } from 'react';

const LoginPage = () => {
   const [state, setState] = useState("Login");
   const [formData, setFormData] = useState({
      name: "",
      password: "",
      email: ""
   });


   const [isLoggedIn, setIsLoggedIn] = useState(false);

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
         setIsLoggedIn(true);
      }
   }, []);
   

   const changeHandler = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

// Inside your React login/signup page
const login = async () => {
   if(!formData.email || !formData.password){
      console.error("Form data is missing required fields");
      return alert("Please fill in all required fields.");
   }

   try {
      const response = await axios.post("http://localhost:3000/api/login",formData,{
         headers: {
            "Content-Type": "application/json",
         },
      }) 

      console.log(response);

      const {status,message,token} = response.data;
      window.location.replace("/");
      window.alert(message);
      localStorage.setItem("token",token);
      console.log('User logged in successfully:', response.data);
      // Handle success, e.g., redirect or show success message
   }
   catch (error) {
      if (error.response) {
         console.error('Error in login:', error.response.data); // Server responded with a status other than 2xx
         alert(error.response.data.error || 'Login error');
      } else if (error.request) {
         console.error('No response from server:', error.request); // Request made, no response
         alert('No response from the server. Please try again later.');
      } else {
         console.error('Error in request setup:', error.message); // Something else caused an error
         alert('An error occurred during login. Please try again.');
      }
   }
};

const signup = async () => {
   // Check formData has required fields
   if ( !formData.name || !formData.email || !formData.password) {
      console.error("Form data is missing required fields");
      return alert("Please fill in all required fields.");
   }
   console.log(formData)
   try {
      const response = await axios.post('http://localhost:3000/api/register', formData, {
         headers: {
            'Content-Type': 'application/json',
         },
      });
      const {status,message} = response.data;
      window.location.replace("/");
      window.alert(message);
      console.log('User registered successfully:', response.data);
      // Handle success, e.g., redirect or show success message

   } catch (error) {
      if (error.response) {
         console.error('Error in register:', error.response.data); // Server responded with a status other than 2xx
         alert(error.response.data.error || 'Registration error');
      } else if (error.request) {
         console.error('No response from server:', error.request); // Request made, no response
         alert('No response from the server. Please try again later.');
      } else {
         console.error('Error in request setup:', error.message); // Something else caused an error
         alert('An error occurred during signup. Please try again.');
      }
   }
};

const logout = () => {
   localStorage.removeItem("token");
   setIsLoggedIn(false);
   alert("You have been logged out.");
   setState("Login");
};


   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
         <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-center text-3xl text-green-600 font-bold mb-6">{isLoggedIn ? "Welcome" : state}</h1>
           
            {isLoggedIn ? (
               <button
                  onClick={logout}
                  className="w-full mt-4 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
               >
                  Logout
               </button>
            ) : (
               <>
           
            <div className="flex flex-col gap-4">
               {state === "Sign Up" && (
                  <input 
                     type="text" 
                     name="name" 
                     value={formData.name} 
                     onChange={changeHandler} 
                     placeholder="Your Name" 
                     className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
               )}
               <input 
                  name="email" 
                  value={formData.email} 
                  onChange={changeHandler} 
                  type="email" 
                  placeholder="Email Address" 
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
               />
               <input 
                  name="password" 
                  value={formData.password} 
                  onChange={changeHandler} 
                  type="password" 
                  placeholder="Password" 
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
               />
            </div>
            <button 
               onClick={() => { state === "Login" ? login() : signup() }} 
               className="w-full mt-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
            >
               Continue
            </button>

            {state === "Sign Up" ? (
               <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account? 
                  <span 
                     onClick={() => { setState("Login") }} 
                     className="text-green-600 cursor-pointer hover:underline"
                  >
                     Log in here
                  </span>
               </p>
            ) : (
               <p className="mt-4 text-center text-sm text-gray-600">
                  Create an account? 
                  <span 
                     onClick={() => { setState("Sign Up") }} 
                     className="text-green-600 cursor-pointer hover:underline"
                  >
                     Click Here
                  </span>
               </p>
            )}
            </>
            )}
         </div>
      </div>
   );
}
export default LoginPage;
