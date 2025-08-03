"use client";

import {useState, ChangeEvent, FormEvent, FC} from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { Input } from "@/components/ui/input";
// @ts-ignore
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
}
// @ts-ignore
from "@/components/ui/card";
import {Link, useNavigate} from "react-router-dom";
// @ts-ignore
import LoadingIndicator from "../components/LoadingIndicator";
// @ts-ignore
import api from "../api";
// @ts-ignore
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

// Define props for LoginPage
interface FormProps {
  route?: string;
  method?: string;
}

const LoginPage: FC<FormProps> = ({ route = "/api/login/", method = "login" }) => {
  // State for UI and form fields
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  /**
   * Handles the form submission event.
   * Sends username and password to the provided route,
   * stores tokens on success, and navigates to the home page.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate password rules similar to ProfileEdit
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }
      if (!/[A-Z]/.test(password)) {
        throw new Error("Password must contain at least one uppercase letter.");
      }
      if (!/\d/.test(password)) {
        throw new Error("Password must contain at least one digit.");
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        throw new Error("Password must contain at least one special character.");
      }
      if (/\s/.test(password)) {
        throw new Error("Password must not contain whitespace.");
      }

      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      alert(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 dark:from-gray-800 dark:to-gray-900 p-4 overflow-hidden">

      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      >
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Tezrisat_Logo_Transparent.png"
              alt="Tezrisat Platform Interface"
              style={{ width: "6%", height: "5%", objectFit: "contain" }}
              className="hidden md:block"
            />
            <span className="text-xl font-bold text-white">Tezrisat</span>
          </Link>
        </div>
      </header>

      {/* Background SVG Animation */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <motion.path
            d="M0,50 C20,30 50,30 50,50 C50,70 80,70 100,50"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="bg-white/10 dark:bg-gray-800/90 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section: Form */}
            <div className="md:w-1/2 p-6 md:p-10 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl font-bold text-black">Welcome Back</CardTitle>
                <CardDescription className="text-teal-100 dark:text-gray-400">
                  Sign in to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-black">
                      Username
                    </Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setUsername(e.target.value)
                        }
                        className="pl-10 bg-white/20 border-white/30 text-black placeholder-black/50 dark:bg-gray-600"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={18} />
                    </div>
                  </div>
                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-black">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        className="pl-10 pr-10 bg-white/20 border-white/30 text-black placeholder-white/50 dark:bg-gray-600"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 dark:bg-gray-600" size={18} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-black dark:bg-gray-600">
                    Sign In
                  </Button>
                  {loading && <LoadingIndicator />}
                </form>
              </CardContent>
              <CardFooter className="p-0 flex justify-between items-center">
                <a href="#" className="text-sm text-teal-100 hover:text-black dark:text-gray-400 dark:hover:text-black">
                  Forgot your password?
                </a>
                <a href="/register" className="text-sm text-teal-100 hover:text-black dark:text-gray-400 dark:hover:text-black">
                  Sign Up
                </a>
              </CardFooter>
            </div>
            {/* Right Section: Animated Illustration */}
            <div className="md:w-1/2 bg-teal-600 dark:bg-gray-700 flex items-center justify-center p-6 md:p-10">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 rounded-full bg-teal-500 dark:bg-gray-600 flex items-center justify-center"
              >
                <User className="w-24 h-24 text-black" />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
