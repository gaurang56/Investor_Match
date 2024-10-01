"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaRocket,
  FaBriefcase,
  FaFileAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaCoffee,
  FaMagic,
  FaUserTie,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from '../../../convex/generated/api';
import Home from '../home/page';
import { useInvestors } from '../InvestorsContext';

const steps = [
  { name: "Industry", icon: FaBriefcase },
  { name: "Stage", icon: FaRocket },
  { name: "Description", icon: FaFileAlt },
  { name: "Location", icon: FaMapMarkerAlt },
];

const loadingMessages = [
  { text: "Summoning unicorns to review your startup...", icon: FaMagic },
  { text: "Teaching AI to speak 'Venture Capitalist'...", icon: FaUserTie },
  { text: "Polishing the crystal ball for accurate predictions...", icon: FaSearch },
  { text: "Convincing Elon Musk to retweet your pitch...", icon: FaRocket },
  { text: "Searching for investors under couch cushions...", icon: FaSearch },
  { text: "Bribing the algorithm with virtual cookies...", icon: FaCoffee },
  { text: "Sending carrier pigeons to Silicon Valley...", icon: FaRocket },
  { text: "Consulting the ancient startup oracles...", icon: FaMagic },
  { text: "Aligning the stars for your funding round...", icon: FaMagic },
  { text: "Hacking into the matrix for better matches...", icon: FaSearch },
];

export default function EnhancedOnboardingWidget() {
  const { isSignedIn } = useSession();
  const createFormInput = useMutation(api.functions.createFormData);
  const storeInvestorData = useMutation(api.functions.storeInvestorData);
  const investorList = useQuery(api.functions.getInvestors);
  const { setInvestors2 } = useInvestors();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    industry: "",
    stage: "",
    description: "",
    location: "",
  });
  const [investors, setInvestors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const router = useRouter();

  useEffect(() => {
    console.log(investors)
    if (!isLoading && investors) {
        console.log(investors)
        setInvestors2(JSON.parse(investors));
        router.push("/home");
    }
  }, [isLoading, investors, router]);


  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      handleNext();
      return;
    }
    setIsLoading(true);
    setInvestors(null);
    setLoadingProgress(0);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('http://127.0.0.1:5000/find_investors', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch investors');
      }
      
      const data = await response.json();
      setInvestors(data.investors);

      await storeInvestorData({ investors: data.investors });
      await createFormInput(formData);

      console.log(formData);
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("An error occurred while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && currentStep < steps.length - 1) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        setLoadingProgress((prevProgress) => Math.min(prevProgress + 10, 100));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const currentLoadingMessage = loadingMessages[loadingMessageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {isSignedIn ? <SignOutButton /> : <SignInButton />}
      <h1 className="text-2xl font-bold mb-4">Credits: Unlimited - perks of being a developer Whoo!</h1>
      
      {isSignedIn && !isLoading && (
        <div className="w-full max-w-lg z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
                AloAngels
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Let's find the perfect investors for your startup
              </p>

              <div className="flex justify-between mb-6">
                {steps.map((step, index) => (
                  <div key={step.name} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        index <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span
                      className={`text-xs mt-1 ${
                        index <= currentStep ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>

              <Progress
                value={((currentStep + 1) / steps.length) * 100}
                className="mb-6"
              />

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 0 && (
                      <div className="space-y-4">
                        <Label htmlFor="industry" className="text-gray-700">
                          What industry is your startup in?
                        </Label>
                        <Input
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                          placeholder="e.g. Fintech, Healthcare"
                        />
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <Label htmlFor="stage" className="text-gray-700">
                          What stage is your startup at?
                        </Label>
                        <Input
                          id="stage"
                          name="stage"
                          value={formData.stage}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                          placeholder="e.g. Seed, Series A"
                        />
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <Label htmlFor="description" className="text-gray-700">
                          Briefly describe your startup
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 min-h-[100px]"
                          placeholder="What problem does your startup solve?"
                        />
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <Label htmlFor="location" className="text-gray-700">
                          Where is your startup based?
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="px-4 py-2 text-gray-600 border-gray-300 hover:bg-gray-100"
                  >
                    <FaChevronLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className={`${
                      currentStep === steps.length - 1
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white px-4 py-2`}
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        Complete
                        <FaCheck className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Next
                        <FaChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {isLoading && (
        <div className="w-full max-w-lg z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Finding Your Perfect Investors
            </h2>
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {React.createElement(currentLoadingMessage.icon, { className: "text-blue-500 text-4xl" })}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-center mb-6 text-lg font-medium">{currentLoadingMessage.text}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{width: `${loadingProgress}%`}}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-500">{loadingProgress}% Complete</p>
          </motion.div>
        </div>
      )}
      
      {!isLoading && (
        <div></div>

        /*<div className="w-full max-w-lg mt-8">
          {investors && (
            <div className="p-6 bg-white rounded-lg shadow mb-4">
              <h3 className="text-xl font-semibold mb-4">Suggested Investors:</h3>
              <p className="text-gray-700">{investors}</p>
            </div>
          )}
          
          {investorList && investorList.length > 0 && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Previously Suggested Investors:</h3>
              {investorList.map((detail:any, index:any) => (
                <div key={index} className="mb-2 p-3 bg-gray-50 rounded">
                <p className="text-gray-700">{detail.data}</p>
              </div>
            ))}
          </div>
        )}
      </div>*/
    )}
  </div>
);
}