"use client";

import { useState } from "react";
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
import { X, Mail, Phone, ArrowLeft } from "lucide-react";

type Step = "welcome" | "method" | "otp" | "password" | "role" | "complete";

export default function AuthModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<Step>("welcome");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [role, setRole] = useState<"photographer" | "hirer" | null>(null);

  const reset = () => {
    setStep("welcome");
    setEmailOrPhone("");
    setRole(null);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
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
                Want to join Imfo Bookings?
              </DialogTitle>
              <p className="text-gray-600 mb-8">
                Sign in or create an account to book our photographers, or join
                us as a photographer.
              </p>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
                onClick={() => setStep("method")}
              >
                Enter email
              </Button>
              <div className="my-4 text-sm text-gray-500">or</div>
              <Button variant="outline" className="w-full mb-4">
                <Mail className="mr-2 h-4 w-4" /> Continue with email
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" /> Continue with phone number
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
          {step === "method" && (
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
                Please enter the OTP to sign up.
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
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Sign up
              </Button>
            </>
          )}
          {step === "password" && (
            <>
              <button
                onClick={() => setStep("method")}
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
                onClick={() => setStep("complete")}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
