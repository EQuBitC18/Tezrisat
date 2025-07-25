"use client";

// @ts-ignore
import api from "../api";
import React, {useState, useCallback, FC} from "react";
import { motion } from "framer-motion";
import { Upload, Link as LinkIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import ScrollProgressBar from "../components/ScrollProgressBar";
import Background from "../components/Background";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingPage from "./LoadingPage";

/**
 * Interface for the microcourse data passed through navigation state.
 * Note: We use camelCase for local variable names then convert when sending to API.
 */
interface NewMicrocourse {
  title: string;
  topic: string;
  complexity: string;
  targetAudience: string;
}

const ResourceUpload: FC = () => {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  // State for URLs (initially one empty URL field)
  const [urls, setUrls] = useState<string[]>([""]);
  // State for uploaded PDF files
  const [files, setFiles] = useState<File[]>([]);
  // Loading indicator state
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const navigate = useNavigate();
  const location = useLocation();


  // Assert and extract newMicrocourse from navigation state
  const newMicrocourse = (location.state as { newMicrocourse: NewMicrocourse } | undefined)?.newMicrocourse;
  if (!newMicrocourse) {
    // If there's no microcourse data, redirect to the appropriate start page.
    navigate("/mc-builder-basis");
    return null;
  }

  /**
   * Adds a new empty URL field.
   */
  const handleAddUrl = () => {
    setUrls((prevUrls) => [...prevUrls, ""]);
  };

  /**
   * Updates the value of a URL input at a specific index.
   * @param index - Position of the URL input in the array.
   * @param value - The new URL value.
   */
  const handleUrlChange = (index: number, value: string) => {
    setUrls((prevUrls) => {
      const updatedUrls = [...prevUrls];
      updatedUrls[index] = value;
      return updatedUrls;
    });
  };

  /**
   * Handles the file drop event. Appends the new files to the existing state.
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  /**
   * Handles the form submission by preparing the form data and sending it to the API.
   * On successful upload, navigates the user back to the home page.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // Map camelCase keys to API-expected snake_case keys:
    formData.append("title", newMicrocourse.title);
    formData.append("topic", newMicrocourse.topic);
    formData.append("complexity", newMicrocourse.complexity);
    formData.append("target_audience", newMicrocourse.targetAudience);

    // Append each non-empty URL field
    urls.forEach((url) => {
      if (url.trim() !== "") {
        formData.append("url", url);
      }
    });

    // Append all PDF files
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("pdf", file);
      });
    }

    // Append empty fields for additional microcourse sections
    formData.append("section_title", "");
    formData.append("content", "");
    formData.append("recall_notes", "");
    formData.append("vocabulary", "");
    formData.append("quiz", "");
    formData.append("code_examples", "");
    formData.append("math_expressions", "");

    try {
      setIsLoading(true);
      console.log("hier 2");
      const response = await api.post("/api/add_microcourse/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error uploading resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <div className="loading-page">
      <LoadingPage />
    </div>
  ) : (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Scroll Progress Bar & Background */}
      <ScrollProgressBar />
      <Background />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1">
        <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 p-6 ml-64">
          <Header />

          {/* Resource Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Upload Resources</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Website URL Inputs */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium mb-2">
                  Website URL(s)
                </label>
                {urls.map((url, index) => (
                  <div key={index} className="relative mb-4">
                    <input
                      type="url"
                      id={`url-${index}`}
                      name="url"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      pattern="https://.*"
                      className="w-full pl-10 pr-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="https://example.com"
                    />
                    <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-teal-300" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="inline-flex items-center px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  + Add new URL
                </button>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">PDF Upload</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed border-white/50 rounded-md p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? "bg-white/30" : "hover:bg-white/10"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-teal-300 mb-4" />
                  {isDragActive ? (
                    <p>Drop the PDF files here...</p>
                  ) : (
                    <p>
                      Drag &apos;n&apos; drop PDF files here, or click to select files
                    </p>
                  )}
                </div>
              </div>

              {/* Display Selected Files */}
              {files.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
                  <ul className="list-disc pl-5">
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
                >
                  Upload Resources
                  <Upload className="ml-2 w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </main>
      </div>

      <Footer isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default ResourceUpload;