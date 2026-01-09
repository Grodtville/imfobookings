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
import { X, Mail, ArrowLeft, Loader2 } from "lucide-react";
import {
  tokenLogin as apiTokenLogin,
  createUser as apiCreateUser,
  me as apiMe,
} from "@/lib/auth";
import { handleAPIError } from "@/lib/auth-utils";
import { signIn as nextSignIn, getSession } from "next-auth/react";
import API from "@/lib/api";

type Step =
  | "welcome"
  | "login"
  | "signup"
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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      signIn(demoUser, "local-token");
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
              <Label className="self-start">Create password</Label>
              <Input
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4"
              />
              {error && (
                <div className="w-full p-3 mb-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                  {error}
                </div>
              )}
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading || !emailOrPhone || !password}
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    // create user via backend - requires username, email, password
                    await apiCreateUser({
                      username: emailOrPhone,
                      email: emailOrPhone,
                      password,
                    });
                    // sign in via NextAuth credentials provider
                    const res = await nextSignIn("credentials", {
                      redirect: false,
                      username: emailOrPhone,
                      password,
                    } as any);
                    if (res?.ok) {
                      const session = await getSession();
                      const access = (session as any)?.accessToken;
                      const sessionUser = (session as any)?.user || null;
                      if (access) {
                        try {
                          localStorage.setItem("imfo_token", access);
                        } catch (err) {}
                      }
                      if (sessionUser) {
                        try {
                          localStorage.setItem(
                            "imfo_user",
                            JSON.stringify(sessionUser)
                          );
                        } catch (err) {}
                        try {
                          signIn(sessionUser, access || undefined);
                        } catch (e) {
                          /* ignore */
                        }
                      }
                      // Show role selection after successful signup
                      setStep("role");
                      return;
                    }
                    // fallback demo sign in
                    signInDemoUser();
                    setStep("role");
                  } catch (err: any) {
                    setError(handleAPIError(err));
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
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
                className="mb-4"
              />
              {error && (
                <div className="w-full p-3 mb-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                  {error}
                </div>
              )}
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading || !emailOrPhone || !password}
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    const res = await nextSignIn("credentials", {
                      redirect: false,
                      username: emailOrPhone,
                      password,
                    } as any);
                    if (res?.ok) {
                      const session = await getSession();
                      const access = (session as any)?.accessToken;
                      const user = (session as any)?.user || null;
                      if (access) {
                        try {
                          localStorage.setItem("imfo_token", access);
                        } catch (err) {}
                      }
                      if (user) {
                        try {
                          localStorage.setItem(
                            "imfo_user",
                            JSON.stringify(user)
                          );
                        } catch (err) {}
                        try {
                          signIn(user, access || undefined);
                        } catch (e) {
                          /* ignore */
                        }
                      }
                      handleClose();
                      router.push("/");
                    } else {
                      setError(
                        res?.error === "CredentialsSignin"
                          ? "Invalid email or password"
                          : res?.error || "Login failed"
                      );
                    }
                  } catch (err: any) {
                    setError(handleAPIError(err));
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
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
                disabled={!role || loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    // Try to update user role in backend
                    const storedUser = localStorage.getItem("imfo_user");
                    if (storedUser) {
                      const userData = JSON.parse(storedUser);
                      if (userData?.id) {
                        // First try to get existing profile
                        try {
                          const profileRes = await API.get(
                            `/v1/profile/id/${userData.id}`
                          );
                          // Profile exists, update it
                          if (profileRes.data?.id) {
                            await API.put(
                              `/v1/profile/${profileRes.data.id}/edit`,
                              {
                                user_type: role,
                              }
                            );
                          }
                        } catch (err: any) {
                          // Profile doesn't exist, try to create one
                          if (err.response?.status === 404) {
                            try {
                              await API.post("/v1/profile/new-profile", {
                                name: userData.name || userData.email || "",
                                username:
                                  userData.email ||
                                  userData.name ||
                                  `user_${Date.now()}`,
                                user_type: role,
                              });
                            } catch (createErr) {
                              console.log("Could not create profile with role");
                            }
                          } else {
                            console.log("Could not update user role:", err);
                          }
                        }
                        // Update local storage with role
                        userData.role = role;
                        localStorage.setItem(
                          "imfo_user",
                          JSON.stringify(userData)
                        );
                      }
                    }
                  } catch (err) {
                    console.log("Error saving role");
                  } finally {
                    setLoading(false);
                  }

                  // Redirect based on role
                  if (role === "hirer") {
                    handleClose();
                    router.push("/search");
                  } else {
                    // Photographer - go to their profile page
                    handleClose();
                    const storedUser = localStorage.getItem("imfo_user");
                    if (storedUser) {
                      const userData = JSON.parse(storedUser);
                      if (userData?.id) {
                        router.push(`/profiles/${userData.id}`);
                      } else {
                        router.push("/dashboard/edit-profile");
                      }
                    } else {
                      router.push("/dashboard/edit-profile");
                    }
                  }
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Agree and continue"
                )}
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
