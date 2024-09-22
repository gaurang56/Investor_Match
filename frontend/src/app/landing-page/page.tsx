'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, CheckCircle, DollarSign, LineChart, Search, Users, ChevronRight } from 'lucide-react'
import {Sheet,SheetClose,SheetContent,SheetDescription,SheetFooter,SheetHeader,SheetTitle,SheetTrigger,} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Menu } from 'lucide-react';

const MotionCard = motion(Card)

export default function LandingPage() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [step, setStep] = useState(0)
  const [industry, setIndustry] = useState('')
  const [fundingGoal, setFundingGoal] = useState('')
  const [burgerVisible, setBurgerVisibility] = useState(false);
  const toggleBurgerButton = () => {
    setBurgerVisibility(!burgerVisible);
};

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const handleContinue = () => {
    if (step === 0 && industry) {
      setStep(1)
    } else if (step === 1 && fundingGoal) {
      console.log({ industry, fundingGoal })
      // Here you would typically send this data to your backend or perform some action
      setStep(2)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        {/* sticky header */}
        <div className="bg-white fixed top-0 left-0 right-0 shadow-lg z-50 lg:px-32 px-10">
            <div className="flex justify-between items-center p-4">
                <p className="text-xl font-bold">VentureMate</p>
                <div className="space-x-4 hidden lg:block">
                    <a href="#" className="relative inline-block group hover:text-indigo-600">
                    Home
                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </a>
                    <a href="#howItWorks" className="relative inline-block group hover:text-indigo-600">
                    Services
                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </a>
                    <a href="#pricing" className="relative inline-block group hover:text-indigo-600">
                    Pricing
                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </a>
                    <a href="#" className="relative inline-block group hover:text-indigo-600">
                    Team
                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </a>
                    <a href="#contact" className="relative inline-block group hover:text-indigo-600">
                    Contact
                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </a>
                        <Button size="default" className="mr-4 bg-indigo-600 hover:bg-indigo-700 text-white">Login</Button>
                </div>
                <div onClick={toggleBurgerButton} className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Menu />
                        </SheetTrigger>
                        <SheetContent className='bg-white'>
                            <SheetClose asChild>
                                <div className='flex flex-col gap-4'>
                                    
                                    <a href="#">Home</a>
                                    <a href="#howItWorks">Services</a>
                                    <a href="#pricing">Pricing</a>
                                    <a>Team</a>
                                    <a href="#contact">Contact</a>

                                </div>
                                
                            </SheetClose>
                            
                            
                    
                        </SheetContent>
                    </Sheet>

                </div>
            </div>
        </div>

        <div className='lg:flex items-center justify-center pt-60 pb-44 px-20 gap-10'>
        
      {/* Hero Section */}
      <section className="container text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 text-indigo-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Connect with the Right Investors, Faster
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-8 text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          AI-powered matching for startups and VCs
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button size="lg" className="mr-4 bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
          <Button size="lg" variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">Learn More</Button>
        </motion.div>
      </section>

      {/* Personalized Onboarding Widget */}
      <section className="container mt-10 lg:mt-0">
        <Card className="bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="bg-indigo-900 text-white p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Personalize Your Investor Matching</h3>
                <p className="text-indigo-200">Tell us about your startup to get tailored recommendations</p>
              </div>
              <div className="col-span-2 p-8">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div
                      key="industry"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-xl font-semibold mb-4 text-indigo-900">What's your industry?</h4>
                      <Select onValueChange={setIndustry}>
                        <SelectTrigger className="w-full mb-4">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="health">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div
                      key="funding"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-xl font-semibold mb-4 text-indigo-900">What's your funding goal?</h4>
                      <Select onValueChange={setFundingGoal}>
                        <SelectTrigger className="w-full mb-4">
                          <SelectValue placeholder="Select your funding goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seed">Seed ($100k - $1M)</SelectItem>
                          <SelectItem value="seriesA">Series A ($1M - $5M)</SelectItem>
                          <SelectItem value="seriesB">Series B ($5M - $20M)</SelectItem>
                          <SelectItem value="seriesC">Series C ($20M+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2 text-indigo-900">Great! We're all set.</h4>
                      <p className="text-indigo-600 mb-4">We'll use this information to find the best matches for you.</p>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        View Your Matches
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {step < 2 && (
                  <Button 
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
                    onClick={handleContinue}
                    disabled={(step === 0 && !industry) || (step === 1 && !fundingGoal)}
                  >
                    Continue <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      </div>

      {/* Animated Feature Section */}
      <section className="container mx-auto px-4 " ref={ref}>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-indigo-900">Why Choose Us?</h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerChildren}
          initial="hidden"
          animate={controls}
        >
          {[
            { icon: LineChart, title: "Precision Matching", content: "15+ metrics for accurate startup-VC alignment" },
            { icon: Search, title: "Time-Saving Research", content: "Save months of manual investor research and outreach" },
            { icon: Users, title: "Tailored Insights", content: "Rich investor data for customized pitching strategies" }
          ].map((feature, index) => (
            <MotionCard
              key={index}
              variants={fadeInUp}
              className="border border-indigo-200 shadow-lg bg-white flex flex-col justify-center items-center transition-transform duration-300 transform hover:shadow-2xl hover:scale-120 group"
            >
              <CardHeader className='flex justify-center items-center gap-4'>
                <div className="border border-indigo-100 rounded-full p-4 flex justify-center items-center transition-colors duration-300 group-hover:bg-indigo-600">
                    <feature.icon className="text-indigo-600 w-12 h-12 transition-colors duration-300 group-hover:text-white " />
                </div>
                <CardTitle className="flex items-center text-indigo-900 font-bold ">
                  
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-indigo-600">
                {feature.content}
              </CardContent>
            </MotionCard>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="howItWorks" className="container mx-auto px-4 py-20 bg-indigo-50">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-indigo-900">How It Works</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200"></div>
          {[
            { step: 1, title: "Input your startup details", description: "Provide comprehensive information about your startup" },
            { step: 2, title: "Our AI analyzes and matches", description: "Advanced algorithms process your data to find ideal investors" },
            { step: 3, title: "Connect with top-matching investors", description: "Receive a curated list of investors tailored to your startup" }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              className={`flex items-center mb-12 ${item.step % 2 === 0 ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, x: item.step % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="w-1/2 px-4">
                <h3 className="text-2xl font-bold mb-2 text-indigo-900">{item.title}</h3>
                <p className="text-indigo-600">{item.description}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center z-10 text-white font-bold">
                {item.step}
              </div>
              <div className="w-1/2 px-4"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-indigo-900">What Our Users Say</h2>
        <Tabs defaultValue="founder" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="founder" className="text-lg">Founder</TabsTrigger>
            <TabsTrigger value="investor" className="text-lg">Investor</TabsTrigger>
          </TabsList>
          {[
            { value: "founder", name: "Sarah J.", role: "Tech Startup Founder", achievement: "Series A Raised", content: "This platform saved us months of research. We found the perfect investors for our AI-driven solution and closed our Series A in record time." },
            { value: "investor", name: "Mark R.", role: "VC Partner", achievement: "Tech-Focused Fund", content: "The quality of startups we've been matched with is impressive. It's dramatically improved our deal flow and the efficiency of our investment process." }
          ].map((testimonial) => (
            <TabsContent key={testimonial.value} value={testimonial.value}>
              <Card className="border border-indigo-200 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-indigo-900">{testimonial.name}, {testimonial.role}</CardTitle>
                  <CardDescription>{testimonial.achievement}</CardDescription>
                </CardHeader>
                <CardContent className="text-indigo-600">
                  "{testimonial.content}"
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-20 bg-indigo-50 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-indigo-900">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {['Starter', 'Growth', 'Enterprise'].map((plan, index) => (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex"
            >
              <Card className={`flex flex-col border border-indigo-200 shadow-lg bg-white ${index === 1 ? 'border-indigo-500 shadow-indigo-100' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-indigo-900">{plan}</CardTitle>
                  <CardDescription>
                    {index === 0 && 'For early-stage startups'}
                    {index === 1 && 'For scaling companies'}
                    {index === 2 && 'For large organizations'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-3xl font-bold mb-4 text-indigo-900">
                    {index === 0 && '$99'}
                    {index === 1 && '$299'}
                    {index === 2 && 'Custom'}
                    <span className="text-sm font-normal text-indigo-600">/month</span>
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Basic investor matching',
                      'Limited profile views',
                      '24/7 support',
                      ...(index > 0 ? ['Advanced analytics', 'Unlimited matches'] : []),
                      ...(index > 1 ? ['Dedicated account manager', 'Custom integrations'] : [])
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center text-indigo-600">
                        <CheckCircle className="mr-2 h-4 w-4 text-indigo-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    {index === 2 ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-indigo-900">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {[
            { question: "How does the AI matching work?", answer: "Our AI uses 15+ metrics to analyze your startup profile and compare it with our extensive database of investors. It considers factors like industry focus, investment stage, funding amount, and more to find the most suitable matches." },
            { question: "Is my data secure?", answer: "Absolutely. We use bank-level encryption and adhere to strict data protection regulations to ensure your information is always safe and confidential." },
            { question: "How often is the investor database updated?", answer: "Our database is updated in real-time. As soon as new investor information becomes available or existing data changes, it's reflected in our system." },
            { question: "Can I use this platform if I'm not a tech startup?", answer: "Yes! While we have a strong presence in the tech sector, our platform caters to startups across various industries. The AI adapts its matching criteria based on your specific sector." },
            { question: "What if I'm not satisfied with the matches?", answer: "We offer a satisfaction guarantee. If you're not happy with your initial matches, our team will work with you to refine your profile and search criteria to improve results. We're committed to your success." }
          ].map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-indigo-200 mb-4 rounded-lg bg-white">
              <AccordionTrigger className="text-left px-4 py-2 hover:no-underline hover:bg-indigo-50 rounded-t-lg text-indigo-900">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2 text-indigo-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Call to Action Section */}
      <section id="contact"className="mx-auto px-4 py-20 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white ">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Fundraising?</h2>
        <p className="text-xl mb-8 text-indigo-100">Join thousands of startups finding their perfect investors</p>
        <div className="flex justify-center items-center space-x-4">
          <Input type="email" placeholder="Enter your email" className="max-w-sm border-indigo-300 bg-white text-indigo-900 placeholder-indigo-400" />
          <Button size="lg" className="flex items-center bg-white hover:bg-indigo-100 text-indigo-600">
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Product", links: ["Features", "Pricing", "FAQ"] },
              { title: "Company", links: ["About Us", "Careers", "Contact"] },
              { title: "Resources", links: ["Blog", "Guides", "Events"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] }
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-bold mb-4 text-white">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-indigo-300 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-indigo-800 text-center text-indigo-400">
            © {new Date().getFullYear()} AI Investor Matching. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}