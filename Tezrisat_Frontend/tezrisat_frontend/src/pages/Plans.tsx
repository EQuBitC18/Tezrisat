"use client";

import { useState } from 'react';
import {Check, HelpCircle} from 'lucide-react';
// @ts-ignore
import { Button } from "@/components/ui/button";
// @ts-ignore
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// @ts-ignore
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// @ts-ignore
import { Label } from "@/components/ui/label";
// @ts-ignore
import { Badge } from "@/components/ui/badge";
import Background from "../components/Background.tsx";
import Navigation from "../components/Navigation.tsx";
// @ts-ignore
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {PricingFaq} from "../components/pricing-faq.tsx";
// @ts-ignore
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"



/**
 * PaymentPage Component
 *
 * Displays available payment plans and allows the user to select a plan.
 * Also includes a dark mode toggle for demonstration.
 */
export default function PaymentPage() {
  // State to manage the selected plan, dark mode, and sidebar visibility.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      {/* Background and Navigation */}
      <Background />

      <div className="min-h-screen bg-gradient-to-br from-teal-300 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white transition-colors duration-300 flex">
        <div className="w-[256px]">
          <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
        </div>

        {/* Hero section */}
        <div className="flex-1 p-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Generate customized microcourses on any topic with our AI-powered platform. Choose the plan that works for
              your learning needs.
            </p>
          </div>

          {/* Pricing tabs */}
          <Tabs defaultValue="monthly" className="w-full mb-16">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/20 backdrop-blur-sm border border-teal-200/30">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monthly" className="w-full">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Starter Plan */}
                <Card
                    className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <CardHeader>
                    <CardTitle className="text-teal-900 text-2xl">Starter</CardTitle>
                    <CardDescription className="text-teal-700">Perfect for individual learners</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-teal-900">$9</span>
                      <span className="text-teal-700">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">5 microcourses per month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">Basic customization options</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">Text and image content</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">Email support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Get Started</Button>
                  </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="bg-white/50 backdrop-blur-md border-teal-200/60 rounded-3xl shadow-2xl relative transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] z-10 transform md:scale-105">
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-teal-900 text-2xl">Pro</CardTitle>
                    <CardDescription className="text-teal-700">Ideal for serious learners</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-teal-900">$29</span>
                      <span className="text-teal-700">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                        <span className="text-teal-800">25 microcourses per month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                        <span className="text-teal-800">Advanced customization options</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                        <span className="text-teal-800">Text, image, and video content</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                        <span className="text-teal-800">Priority email support</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                        <span className="text-teal-800">Course analytics</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Get Started</Button>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card
                    className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <CardHeader>
                    <CardTitle className="text-teal-900 text-2xl">Enterprise</CardTitle>
                    <CardDescription className="text-teal-700">For teams and organizations</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-teal-900">$99</span>
                      <span className="text-teal-700">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">Unlimited microcourses</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">Full customization suite</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">All content types + interactive elements</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">Dedicated support manager</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">Advanced analytics & reporting</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-teal-500 shrink-0 mt-0.5"/>
                        <span className="text-teal-800">Custom LLM fine-tuning</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Contact Sales</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Feature comparison */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Feature Comparison</h2>
            <div
                className="bg-white/30 backdrop-blur-sm rounded-3xl border border-teal-200/50 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="border-b border-teal-200/50">
                    <th className="px-6 py-4 text-left text-teal-900 font-medium">Features</th>
                    <th className="px-6 py-4 text-center text-teal-900 font-medium">Starter</th>
                    <th className="px-6 py-4 text-center text-teal-900 font-medium">Pro</th>
                    <th className="px-6 py-4 text-center text-teal-900 font-medium">Enterprise</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr className="border-b border-teal-200/30">
                    <td className="px-6 py-4 text-teal-800">
                      <div className="flex items-center">
                        <span>Monthly microcourses</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 ml-2 text-teal-600"/>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white/90 backdrop-blur-sm border-teal-200/50">
                              <p className="text-teal-800">Number of microcourses you can generate each month</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-teal-800">5</td>
                    <td className="px-6 py-4 text-center text-teal-800">25</td>
                    <td className="px-6 py-4 text-center text-teal-800">Unlimited</td>
                  </tr>
                  <tr className="border-b border-teal-200/30">
                    <td className="px-6 py-4 text-teal-800">Content types</td>
                    <td className="px-6 py-4 text-center text-teal-800">Text, Images</td>
                    <td className="px-6 py-4 text-center text-teal-800">Text, Images, Video</td>
                    <td className="px-6 py-4 text-center text-teal-800">All + Interactive</td>
                  </tr>
                  <tr className="border-b border-teal-200/30">
                    <td className="px-6 py-4 text-teal-800">LLM customization</td>
                    <td className="px-6 py-4 text-center text-teal-800">Basic</td>
                    <td className="px-6 py-4 text-center text-teal-800">Advanced</td>
                    <td className="px-6 py-4 text-center text-teal-800">Full + Fine-tuning</td>
                  </tr>
                  <tr className="border-b border-teal-200/30">
                    <td className="px-6 py-4 text-teal-800">Analytics</td>
                    <td className="px-6 py-4 text-center text-teal-800">Basic</td>
                    <td className="px-6 py-4 text-center text-teal-800">Advanced</td>
                    <td className="px-6 py-4 text-center text-teal-800">Enterprise-grade</td>
                  </tr>
                  <tr className="border-b border-teal-200/30">
                    <td className="px-6 py-4 text-teal-800">Support</td>
                    <td className="px-6 py-4 text-center text-teal-800">Email</td>
                    <td className="px-6 py-4 text-center text-teal-800">Priority Email</td>
                    <td className="px-6 py-4 text-center text-teal-800">Dedicated Manager</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-teal-800">Team members</td>
                    <td className="px-6 py-4 text-center text-teal-800">1</td>
                    <td className="px-6 py-4 text-center text-teal-800">3</td>
                    <td className="px-6 py-4 text-center text-teal-800">Unlimited</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <PricingFaq/>

        </div>
      </div>
    </>
  );
}
