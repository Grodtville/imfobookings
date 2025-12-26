"use client";

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

export default function SettingsPage() {
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

  return (
    <>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Account Information</h1>

        {/* Account Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Email</Label>
              <div className="flex items-center justify-between mt-2">
                <Input
                  defaultValue="jasphoto@gmail.com"
                  disabled
                  className="bg-gray-50"
                />
                <Button
                  variant="secondary"
                  className="ml-4 bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                  Edit
                </Button>
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="flex items-center justify-between mt-2">
                <Input
                  type="password"
                  value="********"
                  disabled
                  className="bg-gray-50"
                />
                <Button
                  variant="secondary"
                  className="ml-4 bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Account Type</Label>
            <div className="flex items-center justify-between mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full" />{" "}
                {/* Radio icon placeholder */}
                <span>Photographer</span>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Switch to Hirer
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You're currently registered as a Photographer
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
