"use client";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";

// If the session exists, shows a sign in button, otherwise a sign out button.
export const SignInButton = ({ session }: { session: Session | null }) => {
    if (session) {
        return (
            <div className="flex flex-col items-center">
                <p>Signed in as {session.user.email}</p>
                <Button
                    className="w-24"
                    onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/" })
                    }
                >
                    Sign Out
                </Button>
            </div>
        );
    }

    return <Button onClick={() => signIn("google")}>Sign In</Button>;
};
