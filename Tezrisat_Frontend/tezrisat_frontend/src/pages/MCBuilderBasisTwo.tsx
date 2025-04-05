"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import ScrollProgressBar from "../components/ScrollProgressBar.tsx";
import Background from "../components/Background.tsx";
import Navigation from "../components/Navigation.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
// @ts-ignore
import api from "../api";
import LoadingPage from "./LoadingPage.tsx";

/**
 * ResourceUpload Component
 *
 * Provides a form for uploading resources (PDFs) and specifying website URLs.
 * While the microcourse is generated, a loading page is displayed.
 */
export default function ResourceUpload() {
  // Sidebar visibility state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // URLs input state (initially one empty URL field)
  const [urls, setUrls] = useState<string[]>(['']);
  // Uploaded files state
  const [files, setFiles] = useState<File[]>([]);
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { newMicrocourse } = location.state || {};

  // Append a new empty URL input
  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  // Update URL value at a given index
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  /**
   * Handles form submission to upload resources and create a microcourse.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newMicrocourse.title);
    formData.append('topic', newMicrocourse.topic);
    formData.append('complexity', newMicrocourse.complexity);
    formData.append('target_audience', newMicrocourse.target_audience);

    // Append each non-empty URL
    urls.forEach((u) => {
      if (u.trim() !== '') {
        formData.append('url', u);
      }
    });

    // Append all PDF files
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('pdf', file);
      });
    }

    // Append empty fields for additional microcourse sections
    formData.append('section_title', "");
    formData.append('content', "");
    formData.append('recall_notes', "");
    formData.append('vocabulary', "");
    formData.append('quiz', "");
    formData.append('code_examples', "");
    formData.append('math_expressions', "");

    try {
      setIsLoading(true);
      const response = await api.post('/api/add_microcourse/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error uploading resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Callback for handling dropped files using react-dropzone.
   * Now, we append new files to the existing list.
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  return (
    <>
      {isLoading ? (
        <div className="loading-page">
          <LoadingPage />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
          {/* Scroll Progress Bar */}
          <ScrollProgressBar />

          {/* Animated Background */}
          <Background />

          {/* Main Content */}
          <div className="relative z-10 flex flex-1">
            <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
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
                    {urls.map((u, index) => (
                      <div key={index} className="relative mb-4">
                        <input
                          type="url"
                          id={`url-${index}`}
                          name="url"
                          value={u}
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
            <label className="block text-sm font-medium mb-2">
              PDF Upload
            </label>
            <div
                      {...getRootProps()}
                      className={`border-2 border-dashed border-white/50 rounded-md p-8 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'bg-white/30' : 'hover:bg-white/10'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="mx-auto h-12 w-12 text-teal-300 mb-4" />
                      {isDragActive ? (
                        <p>Drop the PDF files here ...</p>
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
          {/* Footer */}
          <Footer isSidebarOpen={isSidebarOpen} />
        </div>
      )}
    </>
  );
}
