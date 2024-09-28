"use client"
import { useState } from "react";
import Header from "@/components/header"
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import {
    MapPinIcon,
    GlobeIcon,
    MailIcon,
    TwitterIcon,
    LinkedinIcon,
    FacebookIcon,
    SearchIcon,
    LockIcon,
    SunIcon,
    MoonIcon,
  } from "lucide-react";
import { Button } from "@/components/ui/button";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [result, setResult] = useState<any>([]);
  const [fixedResult, setFixedResult] = useState<any>([])
  const shouldBlur = (likelihood: string) => parseInt(likelihood) > 75;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const getLikelihoodColor = (likelihood: string) => {
    const percentage = parseInt(likelihood);
    if (percentage >= 80) return "bg-emerald-600 text-emerald-50";
    if (percentage >= 70) return "bg-teal-600 text-teal-50";
    if (percentage >= 60) return "bg-amber-600 text-amber-50";
    return "bg-rose-600 text-rose-50";
  };
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch('http://127.0.0.1:5000/find_investors', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const investmentDataArray = data.investors
    .trim()  // Remove leading/trailing whitespace
    .split(/(?<=\d\.)\s+/) // Split on entries that start with a number followed by a dot
    .map(entry => entry.trim()) // Trim each entry
    .filter(entry => entry.length > 0);
    setFixedResult(investmentDataArray)
      console.log(investmentDataArray)  
      setResult(data.investors);
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred. Please try again.');
    }
  };
  const blurMatchReason = (reason: string) => {
    return reason.replace(/\b\w+\b/g, (word) => {
      return word.length > 3 ? "●".repeat(word.length) : word;
    });
  };

  return (
    <div>
        <Header/>
        <h1 className="text-[#333] text-[36px] font-bold mx-8">Startup Investor Matcher</h1>
        <div className="bg-[#ECECEC] px-8 py-4 ">
        <form className="flex gap-4" onSubmit={handleSubmit}>
            <Input className="bg-white" id="description" name="description"  placeholder="Describe your startup" required/>
            <Select  name="industry" required>
            <SelectTrigger  id="industry" className="w-[180px] bg-white">
                <SelectValue  placeholder="Select Your Industry" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Industry</SelectLabel>
                <SelectItem value="AI/Machine Learning">AI/Machine Learning</SelectItem>
                <SelectItem value="FinTech">FinTech</SelectItem>
                <SelectItem value="HealthTech">HealthTech</SelectItem>
                <SelectItem value="EdTech">EdTech</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>

            <Select name="stage"required>
            <SelectTrigger id="stage" className="w-[180px] bg-white">
                <SelectValue  placeholder="Select Your Funding Stage" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Stage</SelectLabel>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
                <SelectItem value="Series C">Series C</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>

            <Input className="bg-white" id = "location" name="location" required placeholder="Location"/>

            <Button type="submit">Find Matching Investors</Button>


        </form>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {fixedResult.map((investor:any, index:any) => (
              <motion.div
                key={investor["Investor Name"]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`${
                    "bg-white"
                  } shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col`}
                >
                  <CardHeader
                    className={`${
                       "bg-gray-50 border-gray-200"
                    } border-b`}
                  >
                    <CardTitle className="flex flex-col gap-2">
                      <div className="flex justify-between items-start w-full">
                        <span
                          className={`text-lg font-semibold ${
                            "text-gray-800"
                          } break-words pr-2`}
                        >
                          {shouldBlur(investor["Likelihood to Invest"])
                            ? "●●●●●"
                            : investor["Investor Name"]}
                        </span>
                        <div className="flex flex-col items-end shrink-0">
                          <Badge
                            className={`${getLikelihoodColor(
                              investor["Likelihood to Invest"]
                            )} text-xs font-medium px-2 py-1`}
                          >
                            {investor["Likelihood to Invest"]}
                          </Badge>
                          <span
                            className={`text-xs mt-1 ${
                               "text-gray-600"
                            }`}
                          >
                            Investment Likelihood
                          </span>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 flex-grow relative">
                    <p
                      className={`text-sm ${
                       "text-gray-600"
                      } mb-4`}
                    >
                      {shouldBlur(investor["Likelihood to Invest"])
                        ? blurMatchReason(investor["Match Reason"])
                        : investor["Match Reason"]}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {investor["Fund Focus Areas"]
                        .split(", ")
                        .map((area:any, idx:any) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className={`${
                               "bg-blue-100 text-blue-800"
                            } text-xs`}
                          >
                            {area}
                          </Badge>
                        ))}
                    </div>
                    <div
                      className={`flex items-center mb-2 ${
                         "text-gray-600"
                      }`}
                    >
                      <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">
                        {investor.Location !== "nan"
                          ? investor.Location
                          : "Not specified"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {investor["Contact Details"].Website && (
                        <a
                          href={investor["Contact Details"].Website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          } hover:underline text-sm`}
                        >
                          <GlobeIcon className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      )}
                      {investor["Contact Details"].Email !== "nan" && (
                        <a
                          href={`mailto:${investor["Contact Details"].Email}`}
                          className={`flex items-center ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          } hover:underline text-sm`}
                        >
                          <MailIcon className="w-4 h-4 mr-2" />
                          {investor["Contact Details"].Email}
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-4">
                      {investor["Contact Details"]["Social Links"].Twitter !==
                        "nan" && (
                        <a
                          href={
                            investor["Contact Details"]["Social Links"].Twitter
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            isDarkMode
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-700"
                          }`}
                        >
                          <TwitterIcon className="w-5 h-5" />
                        </a>
                      )}
                      {investor["Contact Details"]["Social Links"].LinkedIn !==
                        "nan" && (
                        <a
                          href={
                            investor["Contact Details"]["Social Links"].LinkedIn
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            isDarkMode
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-700"
                          }`}
                        >
                          <LinkedinIcon className="w-5 h-5" />
                        </a>
                      )}
                      {investor["Contact Details"]["Social Links"].Facebook !==
                        "nan" && (
                        <a
                          href={
                            investor["Contact Details"]["Social Links"].Facebook
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            isDarkMode
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-700"
                          }`}
                        >
                          <FacebookIcon className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    {shouldBlur(investor["Likelihood to Invest"]) && (
                      <div
                        className={`absolute inset-0 ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        } bg-opacity-80 backdrop-blur-sm flex items-center justify-center`}
                      >
                        <div className="text-yellow-500 flex flex-col items-center">
                          <LockIcon className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium">
                            Upgrade to unlock
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      
      
    </div>
  );
}
