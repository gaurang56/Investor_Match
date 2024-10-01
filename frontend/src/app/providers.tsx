"use client";

import { PropsWithChildren } from "react";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient("https://earnest-sockeye-475.convex.cloud")

export function Providers({children}: PropsWithChildren){
    return (
        <ClerkProvider publishableKey={"pk_test_ZmFpci1mcm9nLTQyLmNsZXJrLmFjY291bnRzLmRldiQ"}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}