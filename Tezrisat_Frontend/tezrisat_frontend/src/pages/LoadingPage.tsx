"use client";

import React, { useRef } from 'react';
// @ts-ignore
import { motion } from 'framer-motion';
import {Canvas, useFrame} from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';

// -----------------------------------------------------------------------------
// CubeAnimation Component
// -----------------------------------------------------------------------------
/**
 * CubeAnimation Component
 *
 * Renders a 3D Rubik's cube composed of 27 smaller boxes. The cube rotates continuously
 * unless the `solved` state is true, in which case it gradually aligns to a solved state using linear interpolation.
 *
 * @returns {JSX.Element} The rendered 3D cube.
 */
const CubeAnimation = () => {
  const cubeRef = useRef();
  const rotationSpeed = 0.01;
  const solveSpeed = 0.05;
  const [solved] = React.useState(false);

  useFrame(() => {
    if (!cubeRef.current) return;
    if (!solved) {
      // @ts-ignore
      cubeRef.current.rotation.x += rotationSpeed;
      // @ts-ignore
      cubeRef.current.rotation.y += rotationSpeed;
    } else {
      // @ts-ignore
      cubeRef.current.rotation.x = Math.lerp(cubeRef.current.rotation.x, 0, solveSpeed);
      // @ts-ignore
      cubeRef.current.rotation.y = Math.lerp(cubeRef.current.rotation.y, 0, solveSpeed);
      // @ts-ignore
      cubeRef.current.rotation.z = Math.lerp(cubeRef.current.rotation.z, 0, solveSpeed);
    }
  });

  return (
    // @ts-ignore
    <group ref={cubeRef}>
      {[...Array(27)].map((_, i) => {
        // Calculate x, y, z positions for a 3x3x3 grid centered at (0,0,0)
        const x = (i % 3) - 1;
        const y = Math.floor((i % 9) / 3) - 1;
        const z = Math.floor(i / 9) - 1;
        return (
          <Box key={i} args={[0.9, 0.9, 0.9]} position={[x, y, z]}>
            <meshStandardMaterial
              color={
                solved
                  ? "white"
                  : // @ts-ignore
                    ["red", "blue", "green", "yellow", "orange", "purple"][Math.floor(Math.random() * 6)]
              }
            />
          </Box>
        );
      })}
    </group>
  );
};

// -----------------------------------------------------------------------------
// LoadingPage Component
// -----------------------------------------------------------------------------
/**
 * LoadingPage Component
 *
 * Displays an animated loading screen featuring:
 * - An animated blob background using an SVG with Framer Motion.
 * - A 3D cube animation rendered with React Three Fiber.
 * - Loading text messages.
 * - A simple footer.
 *
 * @returns {JSX.Element} The rendered LoadingPage component.
 */
function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Animated Blob Background */}
      <div className="fixed inset-0 z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-20">
          <motion.path
            fill="#FFFFFF"
            d="M44.9,-76.8C59.7,-70.1,74,-59.9,83.1,-46.3C92.2,-32.7,96.1,-16.3,94.3,-1.1C92.5,14.2,85,28.3,75.8,41.3C66.6,54.3,55.7,66.1,42.3,74.8C28.9,83.5,14.4,89.1,-0.7,90.3C-15.8,91.5,-31.6,88.4,-45.4,81C-59.2,73.6,-71,61.9,-79.8,47.7C-88.6,33.5,-94.4,16.7,-93.5,0.5C-92.6,-15.7,-85,-31.5,-74.8,-44.8C-64.6,-58.1,-51.8,-69,-38.1,-75.8C-24.4,-82.6,-12.2,-85.3,1.6,-88C15.5,-90.6,30.1,-83.5,44.9,-76.8Z"
            animate={{
              d: [
                "M44.9,-76.8C59.7,-70.1,74,-59.9,83.1,-46.3C92.2,-32.7,96.1,-16.3,94.3,-1.1C92.5,14.2,85,28.3,75.8,41.3C66.6,54.3,55.7,66.1,42.3,74.8C28.9,83.5,14.4,89.1,-0.7,90.3C-15.8,91.5,-31.6,88.4,-45.4,81C-59.2,73.6,-71,61.9,-79.8,47.7C-88.6,33.5,-94.4,16.7,-93.5,0.5C-92.6,-15.7,-85,-31.5,-74.8,-44.8C-64.6,-58.1,-51.8,-69,-38.1,-75.8C-24.4,-82.6,-12.2,-85.3,1.6,-88C15.5,-90.6,30.1,-83.5,44.9,-76.8Z",
                "M47.7,-81.1C62.4,-73.5,75.3,-61.5,84.6,-46.7C93.9,-31.9,99.5,-15.9,98.7,-0.5C97.9,15,90.6,30,81.1,43.2C71.6,56.4,59.8,67.8,45.9,76.3C32,84.8,16,90.4,-0.3,90.9C-16.6,91.4,-33.2,86.7,-48.2,78.7C-63.2,70.7,-76.6,59.4,-85.4,45C-94.2,30.6,-98.4,15.3,-97.1,0.8C-95.8,-13.8,-89,-27.6,-80.1,-40.1C-71.2,-52.6,-60.2,-63.8,-47,-72.6C-33.8,-81.4,-16.9,-87.8,-0.1,-87.6C16.7,-87.4,33.1,-88.7,47.7,-81.1Z",
                "M44.9,-76.8C59.7,-70.1,74,-59.9,83.1,-46.3C92.2,-32.7,96.1,-16.3,94.3,-1.1C92.5,14.2,85,28.3,75.8,41.3C66.6,54.3,55.7,66.1,42.3,74.8C28.9,83.5,14.4,89.1,-0.7,90.3C-15.8,91.5,-31.6,88.4,-45.4,81C-59.2,73.6,-71,61.9,-79.8,47.7C-88.6,33.5,-94.4,16.7,-93.5,0.5C-92.6,-15.7,-85,-31.5,-74.8,-44.8C-64.6,-58.1,-51.8,-69,-38.1,-75.8C-24.4,-82.6,-12.2,-85.3,1.6,-88C15.5,-90.6,30.1,-83.5,44.9,-76.8Z",
              ],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 20,
            }}
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1">
        {/* 3D Cube Animation */}
        <div className="w-64 h-64 mb-8">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <CubeAnimation />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Loading Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold mb-4 text-center"
        >
          Loading Your Microcourse
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-center"
        >
          Please wait while we prepare your learning experience...
        </motion.p>
      </div>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="text-sm mt-4 md:mt-0">
            © 2023 Microcourse Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoadingPage;
