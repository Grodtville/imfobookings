"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Mail, ArrowLeft } from "lucide-react";

type Step =
  | "welcome"
  | "login"
  | "signup"
  | "otp"
  | "password"
  | "role"
  | "hirerChoice"
  | "complete";

export default function AuthModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<Step>("welcome");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"photographer" | "hirer" | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();

  const reset = () => {
    setStep("welcome");
    setEmailOrPhone("");
    setRole(null);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  // use context signIn if available; fallback to localStorage write
  const signInDemoUser = () => {
    const demoUser = {
      id: `local:${emailOrPhone || "me"}`,
      name: emailOrPhone || "Imfo User",
      avatar: "/avatar-anatar.png",
    };
    try {
      signIn(demoUser);
    } catch (e) {
      try {
        localStorage.setItem("imfo_user", JSON.stringify(demoUser));
      } catch (err) {
        /* ignore */
      }
    }
  };

  const signInWithProvider = (provider: "google" | "email") => {
    const demoUser = {
      id: `${provider}:${emailOrPhone || "user"}`,
      name:
        provider === "google"
          ? emailOrPhone || "Google User"
          : emailOrPhone || "Imfo User",
      avatar:
        provider === "google" ? "/avatar-google.png" : "/avatar-anatar.png",
    };
    try {
      signIn(demoUser);
    } catch (e) {
      try {
        localStorage.setItem("imfo_user", JSON.stringify(demoUser));
      } catch (err) {
        /* ignore */
      }
    }
    handleClose();
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-8">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 opacity-70 hover:opacity-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 text-4xl">🎨</div> {/* Your colorful logo */}
          {step === "welcome" && (
            <>
              <DialogTitle className="text-2xl font-bold mb-4">
                Welcome
              </DialogTitle>
              <p className="text-gray-600 mb-6">
                Sign in to your account or join Imfo Bookings to get started.
              </p>
              <div className="w-full grid grid-cols-2 gap-3 mb-4">
                <Button
                  className="w-full bg-white border border-gray-200 text-gray-900"
                  onClick={() => setStep("login")}
                >
                  Log in
                </Button>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setStep("signup")}
                >
                  Join Imfo Bookings
                </Button>
              </div>
              <div className="my-4 text-sm text-gray-500">or</div>
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => signInWithProvider("google")}
              >
                <Mail className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
              <p className="text-xs text-gray-500 mt-6">
                By signing up you accept our{" "}
                <a href="#" className="underline">
                  terms of use
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  privacy policy
                </a>
                .
              </p>
            </>
          )}
          {step === "signup" && (
            <>
              <button
                onClick={() => setStep("welcome")}
                className="self-start mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <DialogTitle className="text-2xl font-bold mb-4">
                Sign up
              </DialogTitle>
              <Label className="self-start">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="mb-4"
              />
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  // simple auth simulation
                  setStep("otp");
                }}
              >
                Log in
              </Button>
            </>
          )}
          {step === "otp" && (
            <>
              <button
                onClick={() => setStep("welcome")}
                className="self-start mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <DialogTitle className="text-2xl font-bold mb-4">
                You're almost there!
              </DialogTitle>
              <p className="text-gray-600 mb-6">
                Please enter the OTP sent to your email.
              </p>
              <Input
                placeholder="······"
                className="text-center text-2xl tracking-widest mb-4"
              />
              <p className="text-sm text-gray-500 mb-6">
                OTP not received?{" "}
                <a href="#" className="text-purple-600">
                  Resend OTP
                </a>
              </p>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  // pretend OTP is valid, sign in and go to role
                  signInDemoUser();
                  setStep("role");
                }}
              >
                Verify
              </Button>
            </>
          )}
          {step === "login" && (
            <>
              <button
                onClick={() => setStep("welcome")}
                className="self-start mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <DialogTitle className="text-2xl font-bold mb-4">
                Log in
              </DialogTitle>
              <Label className="self-start">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="mb-4"
              />
              <Label className="self-start">Password</Label>
              <Input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6"
              />
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  // simple auth simulation
                  signInWithProvider("email");
                }}
              >
                Log in
              </Button>
            </>
          )}
          {step === "password" && (
            <>
              <button
                onClick={() => setStep("welcome")}
                className="self-start mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <DialogTitle className="text-2xl font-bold mb-4">
                Finish signing up.
              </DialogTitle>
              <Label className="self-start">Create password</Label>
              <Input type="password" className="mb-4" />
              <Label className="self-start">Confirm password</Label>
              <Input type="password" className="mb-6" />
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setStep("role")}
              >
                Agree and continue
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                By selecting Agree and continue, I agree to Imfo Bookings' Terms
                of Service, Payments Terms of Service, and Nondiscrimination
                Policy and acknowledge the Privacy Policy.
              </p>
            </>
          )}
          {step === "role" && (
            <>
              <DialogTitle className="text-2xl font-bold mb-4">
                Tell us how you'll use Imfo Bookings
              </DialogTitle>
              <RadioGroup
                value={role || ""}
                onValueChange={(v) => setRole(v as "photographer" | "hirer")}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="hirer" id="hirer" />
                  <Label htmlFor="hirer" className="font-normal">
                    I'm a Hirer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="photographer" id="photographer" />
                  <Label htmlFor="photographer" className="font-normal">
                    I'm a Photographer
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-gray-600 mt-4 mb-6">
                You can switch between Photographer and Hirer roles anytime in
                your account settings. We'll tailor your experience based on
                what you choose today.
              </p>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!role}
                onClick={() => {
                  // persist demo user as logged in
                  signInDemoUser();
                  if (role === "hirer") {
                    setStep("hirerChoice");
                  } else {
                    setStep("complete");
                  }
                }}
              >
                Agree and continue
              </Button>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="marketing" />
                <label htmlFor="marketing" className="text-sm text-gray-600">
                  I don't want to receive marketing messages from Imfo Bookings
                </label>
              </div>
            </>
          )}
          {step === "complete" && (
            <>
              <DialogTitle className="text-2xl font-bold mb-4">
                Welcome to Imfo Bookings!
              </DialogTitle>
              <p className="text-gray-600 mb-8">
                Welcome to Ghana's first photographer booking platform. Ready to
                start earning? Set up your profile to start getting booked.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg">
                Start Setup
              </Button>
            </>
          )}
          {step === "hirerChoice" && (
            <>
              <DialogTitle className="text-2xl font-bold mb-4">
                How would you like to proceed?
              </DialogTitle>
              <p className="text-gray-600 mb-6">
                Set up your profile now for faster bookings, or browse available
                packages.
              </p>
              <div className="grid gap-3">
                <Button
                  className="w-full bg-white border border-gray-200 text-gray-900"
                  onClick={() => {
                    handleClose();
                    router.push("/dashboard/edit-profile");
                  }}
                >
                  Set up profile
                </Button>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    handleClose();
                    router.push("/search");
                  }}
                >
                  Browse packages
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
