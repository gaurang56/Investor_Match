"use client"


import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState('');
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
      setResult(data.investors);
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred. Please try again.');
    }
  };
  return (
    <div className="max-w-[800px] mx-auto my-0 p-[20px]">
      <h1 className="text-[#333] text-[36px] font-bold">Startup Investor Matcher</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>

        <label className="mb-[10px]">Select Your Industry</label>
        <select className="mb-[10px] border border-black" id="industry" name="industry" required>
            <option value="AI/Machine Learning">AI/Machine Learning</option>
            <option value="FinTech">FinTech</option>
            <option value="HealthTech">HealthTech</option>
            <option value="EdTech">EdTech</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Other">Other</option>
        </select>

        <label className="mb-[10px]">Select Your Funding Stage:</label>
        <select className="mb-[10px] border border-black" id="stage" name="stage" required>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Series C">Series C</option>
            <option value="Growth">Growth</option>
        </select>

        <label className="mb-[10px]" >Briefly describe your startup:</label>
        <textarea  className="mb-[10px] border border-black"id="description" name="description" rows={4} required></textarea>

        <label className="mb-[10px]" >Enter your startup's location:</label>
        <input  className="mb-[10px]"type="text" id="location" name="location" required/>

        <button className="p-[10px] bg-[#007bff] text-white border-none cursor-pointer" type="submit" >Find Matching Investors</button>


      </form>

      <div className="mt-[20px] whitespace-pre-wrap">{result}</div>
      
      
    </div>
  );
}
