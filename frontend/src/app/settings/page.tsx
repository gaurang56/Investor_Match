"use client"
import Header from "@/components/header"
import { SubscriptionButton } from "@/components/subscribebtn"
import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";

export default function Settings () {
    return (
        <div className="flex flex-col items-center">
            <Header/>
            <div className="pt-10 w-[50%] flex ">
                <SubscriptionButton/>

            </div>

            <div className="text-white bg-red-500 p-2 rounded-lg">
                <SignOutButton/>
            </div>

            

        </div>
    )
}