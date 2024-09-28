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
interface SocialLinks {
  Twitter?: string;
  LinkedIn?: string;
  Facebook?: string;
}
interface ContactDetails {
  "Partner Name": string;
  Email: string;
  Website: string;
  "Social Links": SocialLinks;
}
interface Investor {
  "Investor Name": string;
  "Fund Focus Areas": string;
  Location: string;
  "Contact Details": ContactDetails;
  "Likelihood to Invest": string;
  "Match Reason": string;
}

export default function Home() {
  const [result, setResult] = useState<any>([]);
  const [investorsData, setInvestorsData] = useState<Investor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
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
        
      let cleanedResultString = data.investors.replace(/```/g, '').replace(/json/g, '').trim();
      console.log(cleanedResultString)
      setInvestorsData(JSON.parse(cleanedResultString));
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
  const uniqueFocusAreas = Array.from(
    new Set(
      investorsData.flatMap((investor) =>
        investor["Fund Focus Areas"].split(", ")
      )
    )
  );
  const filteredInvestors = investorsData.filter(
    (investor) =>
      investor["Investor Name"]
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (!selectedFocus || investor["Fund Focus Areas"].includes(selectedFocus))
  );

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

            <Button className="bg-indigo-900 hover:bg-indigo-800" type="submit">Find Matching Investors</Button>


        </form>

        </div>

        <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="p-4 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center">
            Investor Dashboard
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`rounded-full ${
              isDarkMode
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search investors..."
              className={`pl-10 pr-4 py-2 ${
                isDarkMode
                  ? "bg-gray-800 text-gray-100 border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFocus(null)}
              className={`${
                !selectedFocus
                  ? "bg-blue-600 text-white"
                  : isDarkMode
                  ? "text-blue-400 border-blue-400"
                  : "text-blue-600 border-blue-600"
              }`}
            >
              All
            </Button>
            {uniqueFocusAreas.map((focus) => (
              <Button
                key={focus}
                variant="outline"
                size="sm"
                onClick={() => setSelectedFocus(focus)}
                className={`${
                  selectedFocus === focus
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "text-blue-400 border-blue-400"
                    : "text-blue-600 border-blue-600"
                }`}
              >
                {focus}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredInvestors.map((investor, index) => (
              <motion.div
                key={investor["Investor Name"]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col`}
                >
                  <CardHeader
                    className={`${
                      isDarkMode
                        ? "bg-gray-750 border-gray-700"
                        : "bg-gray-50 border-gray-200"
                    } border-b`}
                  >
                    <CardTitle className="flex flex-col gap-2">
                      <div className="flex justify-between items-start w-full">
                        <span
                          className={`text-lg font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
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
                              isDarkMode ? "text-gray-400" : "text-gray-600"
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
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } mb-4`}
                    >
                      {shouldBlur(investor["Likelihood to Invest"])
                        ? blurMatchReason(investor["Match Reason"])
                        : investor["Match Reason"]}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {investor["Fund Focus Areas"]
                        .split(", ")
                        .map((area, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className={`${
                              isDarkMode
                                ? "bg-blue-900 text-blue-100"
                                : "bg-blue-100 text-blue-800"
                            } text-xs`}
                          >
                            {area}
                          </Badge>
                        ))}
                    </div>
                    <div
                      className={`flex items-center mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
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
    </div>

      
      
    </div>
  );
}
