'use client'

import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs"
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isSignedIn } = useSession();
  const createFormInput = useMutation(api.functions.createFormData);

  return (
    <main>
      {isSignedIn ? <SignOutButton /> : <SignInButton />}

      {isSignedIn && (
        <form onSubmit={async(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(e.currentTarget);
          const industry = formData.get('industry') as string;
          const stage = formData.get('stage') as string;
          const description = formData.get('description') as string;
          const location = formData.get('location') as string;
          
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
    </main>
  );
}
