"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="relative w-full h-screen bg-white">
      <NavBar hasLogin={false} hasFullName={true} hasLinks={false} currentActive={"home"} />
      <div className="w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center gap-2 px-8 sm:max-w-md">
        <Link
          href="/"
          className="group flex items-center rounded-md px-4 py-2 text-sm no-underline text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>
        <div className="flex flex-col items-center gap-2 mt-14 text-black">
          <Image src="/img/logo.svg" alt="Logo" width={130} height={130} />
        </div>
        <LoginWithPassword/>
      </div>
    </div>
  );
}

function LoginWithPassword() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="animate-in text-foreground flex w-full flex-1 flex-col justify-center bg-white">
      <h2 className="text-center text-black mb-10" >Welcome back!</h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          try {
            const formData = new FormData(event.currentTarget);
            formData.set("flow", "signIn");
            await signIn("password", formData);
            setLoading(false);
            router.push("/dashboard");
          } catch (error) {
            setLoading(false);
          }
        }}
      >
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
          className="mb-2 rounded-lg px-4 py-3 bg-gray text-black border-none"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="current-password"
          className="mb-2 rounded-lg px-4 py-3 bg-gray text-black border-none"
        />
        
        <div className="flex flex-col gap-2">
          <Button type="submit" className="btn-generic mt-8 mb-3 py-2 px-4 flex items-center justify-center text-center" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <span className="text-center text-black">
            Don&apos;t have an account? 
            <Button
              type="button"
              variant="link"
              className="redirect-login-signup -ml-4"
              onClick={() => {
                router.push("/signup");
              }}
            >
              Sign up now!
            </Button>
          </span>
        </div>
      </form>
      <Toaster />
    </div>
  );
}
