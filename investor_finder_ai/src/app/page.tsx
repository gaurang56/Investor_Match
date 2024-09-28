'use client'

import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const { isSignedIn } = useSession();
  const createFormInput = useMutation(api.functions.createFormData);
  const storeInvestorData = useMutation(api.functions.storeInvestorData);
  const [investors, setInvestors] = useState<string | null>(null);
  const investorList = useQuery(api.functions.getInvestors)
  return (
    <main>
      {isSignedIn ? <SignOutButton /> : <SignInButton />}
      <h1>Credits: Unlimited - perks of being a developer Whoo!</h1>
      {isSignedIn && (
        <form onSubmit={async(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(e.currentTarget);
          const industry = formData.get('industry') as string;
          const stage = formData.get('stage') as string;
          const description = formData.get('description') as string;
          const location = formData.get('location') as string;
          
          const response = await fetch('http://127.0.0.1:5000/find_investors', {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch investors');
          }
          
          const data = await response.json();
          setInvestors(data.investors);

          // Store investor data in Convex
          await storeInvestorData({ investors: data.investors });

          // pass to our mutation
          await createFormInput({ industry, stage, description, location });
          form.reset();
        }}>
          <label>
            Industry:
            <input type="text" name="industry" required />
          </label>
          <label>
            Stage:
            <input type="text" name="stage" required />
          </label>
          <label>
            Description:
            <textarea name="description" required />
          </label>
          <label>
            Location:
            <input type="text" name="location" required />
          </label>
          <button type="submit">Submit </button>
        </form>
      )}
      {investorList?.map((detail)=>{
        return <div>{detail.data}</div>
      })}
    </main>
  );
}
