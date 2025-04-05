"use client";

import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
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
import Background from "../components/Background.tsx";
import Navigation from "../components/Navigation.tsx";
// @ts-ignore
import api from "../api";

/**
 * ProfileEdit Component
 *
 * Displays a profile settings form where users can update their personal information,
 * change their avatar, and update their password.
 */
export default function ProfileEdit() {
  // State to manage user details and UI elements.
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Track loading and error states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch the current user's data on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await api.get(`/api/profile/`);
        const data = response.data;
        console.log("data", data);

        // Update states with the user info
        setFirstname(data.first_name || "");
        setLastname(data.last_name || "");
        setUsername(data.username || "");
        setEmail(data.email || "");
      } catch (error: any) {
        setErrorMsg(error.message || "Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  /**
   * Handle form submission to update the user profile.
   */
  const handleSave = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      if (!firstname.trim() || !lastname.trim() || !username.trim() || !email.trim()) {
        throw new Error("Please fill in all required fields.");
      }

      // Simple email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      if (password) {
        // Minimum length
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) {
          throw new Error("Password must contain at least one uppercase letter.");
        }
        // At least one digit
        if (!/\d/.test(password)) {
          throw new Error("Password must contain at least one digit.");
        }
        // At least one special character
        if (!/[^A-Za-z0-9]/.test(password)) {
          throw new Error("Password must contain at least one special character.");
        }
        // Forbid whitespace (optional)
        if (/\s/.test(password)) {
          throw new Error("Password must not contain whitespace.");
        }
      }

      await api.post(`/api/updateprofile/`, {
        body: {
          firstname,
          lastname,
          username,
          email,
          password,
        },
      });

      setPassword("");
      setSuccessMsg("Profile updated successfully!");
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background and Navigation Components */}
      <Background />

      {/*
        We use a full-height flex container. The top area holds the Navigation,
        and the main area (flex-1) centers the card both vertically and horizontally.
      */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
        <Navigation
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main content area that centers the card */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-2xl bg-white/10 dark:bg-gray-800/90 backdrop-blur-md shadow-xl">
            <CardHeader className="px-4 sm:px-6 py-4">
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                Profile Settings
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Update your personal information and account settings
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-4 sm:px-6 py-4">
              <div className="space-y-4">
                {/* Firstname Field */}
                <div className="space-y-2">
                  <Label htmlFor="firstname">Firstname</Label>
                  <Input
                    id="firstname"
                    type="text"
                    value={firstname}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setFirstname(e.target.value)}
                    className="bg-white/20 dark:bg-gray-700/50 w-full"
                  />
                </div>

                {/* Lastname Field */}
                <div className="space-y-2">
                  <Label htmlFor="lastname">Lastname</Label>
                  <Input
                    id="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLastname(e.target.value)}
                    className="bg-white/20 dark:bg-gray-700/50 w-full"
                  />
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUsername(e.target.value)}
                    className="bg-white/20 dark:bg-gray-700/50 w-full"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                    className="bg-white/20 dark:bg-gray-700/50 w-full"
                  />
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                    className="bg-white/20 dark:bg-gray-700/50 w-full"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 px-4 sm:px-6 py-4">
              <Button
                onClick={handleSave}
                className="w-full bg-teal-500 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-teal-600"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>

              {/* Display success or error message */}
              {successMsg && (
                <p className="text-green-600 font-semibold text-sm sm:text-base">
                  {successMsg}
                </p>
              )}
              {errorMsg && (
                <p className="text-red-500 font-semibold text-sm sm:text-base">
                  {errorMsg}
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
