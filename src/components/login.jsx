import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AtSign, Lock, Eye, EyeOff } from 'lucide-react';
import { useUser } from "../contexts/Context";
import "./HeaderBear.css";
import { endpoints } from "../utils/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUserId, setUserEmail, setHasBudget, setPlaidConnect } = useUser();

    // Memoize handlers with useCallback
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        try {
            const response = await axios.post(endpoints.auth.login, {
                email: email,
                password: password
            }, { withCredentials: true });

            if (response.data.message === "Login successful") {
                setUserEmail(response.data.user.email);
                setUserId(response.data.user.id);
                setHasBudget(response.data.user.hasBudget);
                
                try {
                    const check = await axios.get(endpoints.plaid.check, { withCredentials: true });
                    setPlaidConnect(check.data.plaidLinked);

                    if (check.data.plaidLinked === true && response.data.user.hasBudget) {
                        navigate("/dashboard");
                    } else {
                        navigate("/setup");
                    }
                } catch (checkError) {
                    console.error("Error checking Plaid status:", checkError);
                    setError("Unable to verify Plaid connection. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    }, [email, password, navigate, setUserId, setUserEmail, setHasBudget, setPlaidConnect]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 w-screen">
            {/* Navigation */}
            <div className="absolute top-0 left-0 w-full p-6">
                <div onClick={() => navigate("/")} className="flex items-center cursor-pointer w-fit">
                    <div className="header-bear"></div>
                    <span className="ml-2 text-xl font-bold text-white">BudgetBuddy</span>
                </div>
            </div>
            
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-blue-300 mt-2">Sign in to your account</p>
                </div>
                
                {error && (
                    <div className="bg-red-900 bg-opacity-40 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSign className="h-5 w-5 text-blue-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-blue-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-blue-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-blue-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-blue-300">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;