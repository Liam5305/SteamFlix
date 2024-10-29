import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import app from '../firebase';

const auth = getAuth(app);

function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user);
        // Handle user logged in state (e.g., redirect)
      } else {
        console.log("No user is logged in");
        // Handle user logged out state
      }
    });
  
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password, username } = formData; // Destructure the formData
  
    try {
      if (isLogin) {
        // Login 
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in user:", userCredential.user);
        // Redirect or show success message
      } else {
        // Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // After successful registration, you can update the username in your database if needed
        console.log("Registered user:", userCredential.user);
        // Redirect or show success message
      }
    } catch (error) {
      console.error("Error during authentication:", error.message);
      // Show error message to the user
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-yellow-400">
          {isLogin ? "Sign In to Your Account" : "Create a New Account"}
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Only show the username input if in register mode */}
            {!isLogin && (
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-300 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700"
                  placeholder="Username"
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-300 ${
                  isLogin ? "rounded-t-md" : ""
                } focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700`}
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-300 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button onClick={() => alert("Not Implemented Yet!")}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-400">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="font-medium text-yellow-400 hover:text-yellow-300"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="font-medium text-yellow-400 hover:text-yellow-300"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Account;
