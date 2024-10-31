import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left half - Solid rectangle */}
      <div className="w-1/2 bg-slate-300 flex items-center justify-center bg-gradient-to-b from-[#124672] to-[#20738E]">
        {/* Optional: Add content here, or leave it blank */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
        </div>
      </div>

      {/* Right half - SignIn Component */}
      <div className="w-1/2 flex items-center justify-center p-4">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-slate-500 hover:bg-slate-400 text-sm',
              card: 'border-none', 
              "signIn": 'border-none', 
              footer: "border-none bg-blue-500"
              
            },
          }}
        />
      </div>
    </div>
  );
}
