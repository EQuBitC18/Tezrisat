"use client";

import { useState, useEffect, FormEvent, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Check } from 'lucide-react';
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { Input } from "@/components/ui/input";
// @ts-ignore
import { Label } from "@/components/ui/label";
// @ts-ignore
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// @ts-ignore
import { Checkbox } from "@/components/ui/checkbox";
// @ts-ignore
import { useNavigate } from "react-router-dom";
// @ts-ignore
import api from "../api";
// @ts-ignore
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// @ts-ignore
import LoadingIndicator from "../components/LoadingIndicator";

/**
 * Props for the RegisterPage component.
 */
interface FormProps {
  route?: string;
  method?: string;
}

/**
 * RegisterPage Component
 *
 * Renders a registration (or login) form with animated UI elements.
 * On submission, it calls an API and navigates accordingly.
 *
 * @param {FormProps} props - Component props.
 */
export default function RegisterPage({ route, method }: FormProps) {
  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  // Error states for username, email, and password
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Navigation hook
  const navigate = useNavigate();

  /**
   * Handle form submission for registration or login.
   *
   * @param {FormEvent<HTMLFormElement>} e - Form event.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    // Validate that passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Post data including email to the specified route
      const res = await api.post(route, { username, email, password });
      // If login, store tokens and navigate to home
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/home");
      } else {
        // Otherwise, navigate to login page after registration
        navigate("/login");
      }
    } catch (error: any) {
      // Check if error response contains field-specific errors
      if (error.response && error.response.data) {
        if (error.response.data.username) {
          setUsernameError(error.response.data.username[0]);
        }
        if (error.response.data.email) {
          setEmailError(error.response.data.email[0]);
        }
        if (error.response.data.password) {
          setPasswordError(error.response.data.password[0]);
        }
      } else {
        setPasswordError("An error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength based on simple criteria
  useEffect(() => {
    let strength = 0;
    if (password.length > 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 dark:from-gray-800 dark:to-gray-900 p-4 overflow-hidden">
      {/* Animated SVG Background */}
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

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-4xl relative z-10">
        <Card className="bg-white/10 dark:bg-gray-800/90 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Form Section */}
            <div className="md:w-1/2 p-6 md:p-10 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl font-bold text-black">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-teal-100 dark:text-gray-400">
                  Sign up to get started with our platform
                </CardDescription>
                <CardDescription className="text-teal-100 dark:text-gray-400">
                  Already have an account?{' '}
                  <a href="/login" className="text-black hover:text-teal-100">
                    Login
                  </a>
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
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setUsername(e.target.value)}
                        className="pl-10 bg-white/20 border-white/30 text-black placeholder-white/50"
                        required
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={18} />
                    </div>
                    {usernameError && (
                      <p className="text-red-500 text-sm mt-1">
                        {usernameError}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value)}
                        className="pl-10 bg-white/20 border-white/30 text-black placeholder-white/50"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={18} />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">
                        {emailError}
                      </p>
                    )}
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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-white/20 border-white/30 text-black placeholder-white/50"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={18} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordError}
                      </p>
                    )}
                    {/* Password Strength Indicator */}
                    <div className="flex space-x-1 mt-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 w-1/4 rounded-full bg-white/20"
                          animate={{
                            backgroundColor: i < passwordStrength ? 'rgb(13 148 136)' : 'rgba(255,255,255,0.2)'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-black">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 bg-white/20 border-white/30 text-black placeholder-white/50"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={18} />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
                    />
                    <label htmlFor="terms" className="text-sm font-medium leading-none text-black">
                      I agree to the terms and conditions
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!agreedToTerms}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-black"
                  >
                    Create Account
                  </Button>
                  {loading && <LoadingIndicator />}
                </form>
              </CardContent>
            </div>

            {/* Animated Side Section */}
            <div className="md:w-1/2 bg-teal-600 dark:bg-gray-700 flex items-center justify-center p-6 md:p-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-48 h-48 rounded-full bg-teal-500 dark:bg-gray-600 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Check className="w-24 h-24 text-black" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
