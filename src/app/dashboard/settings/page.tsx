"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import { Loader2, CheckCircle, Edit, X, Save } from "lucide-react";

type Profile = {
  id: string;
  name: string | null;
  username: string;
  bio: string | null;
  location: string | null;
  photo_url: string | null;
  header_url: string | null;
  services_id: string[];
  website: string | null;
  user_type?: string;
};

export default function SettingsPage() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Editable fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState<string>("photographer");

  // Edit modes
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  // Fetch user data
  useEffect(() => {
    async function fetchData() {
      if (!authUser?.id) {
        setLoading(false);
        return;
      }

      try {
        // Get stored user for email
        const storedUser = localStorage.getItem("imfo_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setEmail(userData.email || "");
          setUserType(userData.role || "photographer");
        }

        // Get profile for additional details
        try {
          const profileRes = await API.get(`/v1/profile/id/${authUser.id}`);
          const profileData = profileRes.data;
          setProfile(profileData);
          setContactName(profileData.name || "");
          setAddress(profileData.location || "");
          if (profileData.user_type) {
            setUserType(profileData.user_type);
          }
        } catch (err) {
          console.log("Could not load profile");
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        setError("Failed to load account information");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [authUser]);

  const handleSaveField = async (field: string, value: string) => {
    if (!profile?.id) {
      setError("No profile found");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updateData: any = {};

      if (field === "email") {
        // Update local storage
        const storedUser = localStorage.getItem("imfo_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.email = value;
          localStorage.setItem("imfo_user", JSON.stringify(userData));
        }
        setEditingEmail(false);
      } else if (field === "contactName") {
        updateData.name = value;
        setEditingContact(false);
      } else if (field === "address") {
        updateData.location = value;
        setEditingAddress(false);
      } else if (field === "phone") {
        // Phone stored in localStorage for now
        const storedUser = localStorage.getItem("imfo_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.phone = value;
          localStorage.setItem("imfo_user", JSON.stringify(userData));
        }
        setEditingPhone(false);
      }

      // Update profile if there are fields to update
      if (Object.keys(updateData).length > 0) {
        await API.put(`/v1/profile/${profile.id}/edit`, updateData);
      }

      setSuccess("Saved successfully!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      console.error("Failed to save:", err);
      setError(err.response?.data?.detail || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchRole = async () => {
    const newRole = userType === "photographer" ? "hirer" : "photographer";

    setSaving(true);
    setError(null);

    try {
      if (profile?.id) {
        await API.put(`/v1/profile/${profile.id}/edit`, {
          user_type: newRole,
        });
      }

      // Update local storage
      const storedUser = localStorage.getItem("imfo_user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.role = newRole;
        localStorage.setItem("imfo_user", JSON.stringify(userData));
      }

      setUserType(newRole);
      setSuccess(
        `Switched to ${
          newRole === "photographer" ? "Photographer" : "Hirer"
        } successfully!`
      );
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      console.error("Failed to switch role:", err);
      setError(err.response?.data?.detail || "Failed to switch role");
    } finally {
      setSaving(false);
    }
  };

  const transactions = [
    {
      date: "October 5, 2025",
      event: "Event Name And So Much More - Ashaiman",
      amount: 4300,
      status: "paid",
    },
    {
      date: "October 5, 2025",
      event: "Event Name And So Much More - Ashaiman",
      amount: 4300,
      status: "paid",
    },
    {
      date: "October 5, 2025",
      event: "Event Name And So Much More - Ashaiman",
      amount: 4300,
      status: "pending",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Account Information</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Account Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6">Contact Details</h3>
          <p className="text-gray-500 text-sm mb-6">
            These details will be used to pre-fill your vendor information when
            creating packages.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Email */}
            <div>
              <Label>Email</Label>
              <div className="flex items-center gap-2 mt-2">
                {editingEmail ? (
                  <>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveField("email", email)}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingEmail(false)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      value={email || "Not set"}
                      disabled
                      className="bg-gray-50 flex-1"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                      onClick={() => setEditingEmail(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label>Phone Number</Label>
              <div className="flex items-center gap-2 mt-2">
                {editingPhone ? (
                  <>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveField("phone", phone)}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingPhone(false)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      value={phone || "Not set"}
                      disabled
                      className="bg-gray-50 flex-1"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                      onClick={() => setEditingPhone(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Contact Name */}
            <div>
              <Label>Contact Person Name</Label>
              <div className="flex items-center gap-2 mt-2">
                {editingContact ? (
                  <>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your full name"
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleSaveField("contactName", contactName)
                      }
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingContact(false)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      value={contactName || "Not set"}
                      disabled
                      className="bg-gray-50 flex-1"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                      onClick={() => setEditingContact(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <Label>Business Address</Label>
              <div className="flex items-center gap-2 mt-2">
                {editingAddress ? (
                  <>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your business location"
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveField("address", address)}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingAddress(false)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      value={address || "Not set"}
                      disabled
                      className="bg-gray-50 flex-1"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                      onClick={() => setEditingAddress(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <Label>Account Type</Label>
            <div className="flex items-center justify-between mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    userType === "photographer"
                      ? "bg-purple-600"
                      : "bg-blue-600"
                  }`}
                />
                <span className="font-medium capitalize">{userType}</span>
              </div>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleSwitchRole}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Switching...
                  </>
                ) : (
                  `Switch to ${
                    userType === "photographer" ? "Hirer" : "Photographer"
                  }`
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You're currently registered as a{" "}
              {userType === "photographer" ? "Photographer" : "Hirer"}
            </p>
          </div>
        </div>

        {/* Billing & Payment History */}
        <h2 className="text-2xl font-bold mb-6">Billing & Payment History</h2>
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6">Transaction Summary</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event Name - Location</TableHead>
                <TableHead>Amount (GH¢)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t, i) => (
                <TableRow key={i}>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.event}</TableCell>
                  <TableCell>{t.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={t.status === "paid" ? "default" : "secondary"}
                    >
                      {t.status === "paid" ? "Deposit paid" : "Deposit pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            variant="secondary"
            className="mt-6 bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            View all transactions
          </Button>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Total Earnings</h3>
            <p className="text-4xl font-bold">GH₵ 12,345</p>
            <p className="text-red-600">- GH₵ 2,550 pending</p>
          </div>
        </div>

        {/* Privacy & Security */}
        <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6">
            Two-Factor Authentication (2FA)
          </h3>
          <p className="text-gray-600 mb-6">
            When we need to verify it's you, which step should we try first?
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS text messages</p>
                <p className="text-sm text-gray-600">
                  Verify with one-time codes sent to your mobile number.
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email passcode</p>
                <p className="text-sm text-gray-600">
                  Verify one-time codes generated with a preferred third party
                  authenticator app.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Authenticator app code</p>
                <p className="text-sm text-gray-600">
                  Verify one-time codes received in your email to confirm it's
                  you.
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Account Management */}
        <h2 className="text-2xl font-bold mb-6">Account Management</h2>
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-xl font-semibold mb-4">
            Account Deactivation/Deletion
          </h3>
          <p className="text-gray-600 mb-6">
            If you need to take a break or leave.
          </p>
          <div className="space-y-6">
            <div>
              <p className="font-medium mb-2">Thinking of taking a break?</p>
              <p className="text-gray-600 mb-4">
                Deactivating your account will hide your profile and pause your
                activity on the platform. Your photos, bookings, and messages
                will no longer be visible to others, but your data will be
                securely stored in case you decide to return.
              </p>
              <Button
                variant="destructive"
                className="bg-purple-600 hover:bg-purple-700"
              >
                I want to deactivate my account
              </Button>
            </div>
            <div>
              <p className="font-medium mb-2">Ready to say goodbye?</p>
              <p className="text-gray-600 mb-4">
                Deleting your account will permanently remove all your data from
                our platform — including your profile, photos, booking history,
                messages, and reviews. Once deleted, your account cannot be
                restored, and any ongoing or pending transactions will be
                cancelled.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                We recommend downloading any important receipts or payment
                records before continuing. If you're only taking a short break,
                consider deactivating your account instead.
              </p>
              <Button variant="destructive">
                Delete my account permanently
              </Button>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
