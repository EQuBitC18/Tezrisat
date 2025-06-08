"use client";

import React, { useEffect, useState, FC, ChangeEvent } from "react";
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
const ProfileEdit: FC = () => {
  // User profile states
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // UI state for sidebar, loading and messages
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Fetch current user's data on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await api.get(`/api/profile/`);
        const data = response.data;
        console.log("User Data:", data);

        // Set user profile values from the API response
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
   * Handle profile update
   */
  const handleSave = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      // Validate required fields
      if (!firstname.trim() || !lastname.trim() || !username.trim() || !email.trim()) {
        throw new Error("Please fill in all required fields.");
      }

      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      // Validate new password rules if provided
      if (password) {
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
      }

      // Send update request to API
      await api.post(`/api/updateprofile/`, {
        body: {
          firstname,
          lastname,
          username,
          email,
          password,
        },
      });

      // Clear the password input after successful update
      setPassword("");
      setSuccessMsg("Profile updated successfully!");
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  // Input change handler type
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  return (
    <>
      {/* Background and Navigation Components */}
      <Background />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
        <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Center the form card */}
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
                    onChange={handleChange(setFirstname)}
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
                    onChange={handleChange(setLastname)}
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
                    onChange={handleChange(setUsername)}
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
                    onChange={handleChange(setEmail)}
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
                    onChange={handleChange(setPassword)}
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

              <Button
                onClick={() => {
                  const portal =
                    "https://billing.stripe.com/p/login/test_dRm9AMe2c1bw4wd1fK5ZC00?prefilled_email=" +
                    encodeURIComponent(email);
                  window.location.href = portal;
                }}
                className="w-full bg-teal-500 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-teal-600"
              >
                Manage Billing
              </Button>

              {/* Display success and error messages */}
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
};

export default ProfileEdit;
