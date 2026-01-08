"use client";

import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthTestPage() {
  const { user, isAuthenticated, isLoading, accessToken, signOut } =
    useAuthState();

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <p>Loading authentication status...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Status:</h3>
            <p className={isAuthenticated ? "text-green-600" : "text-red-600"}>
              {isAuthenticated ? "✓ Authenticated" : "✗ Not Authenticated"}
            </p>
          </div>

          {isAuthenticated && user && (
            <>
              <div>
                <h3 className="font-semibold mb-2">User Info:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>

              {accessToken && (
                <div>
                  <h3 className="font-semibold mb-2">Access Token:</h3>
                  <p className="bg-gray-100 p-4 rounded text-sm break-all">
                    {accessToken.substring(0, 50)}...
                  </p>
                </div>
              )}

              <Button onClick={signOut} variant="destructive">
                Sign Out
              </Button>
            </>
          )}

          {!isAuthenticated && (
            <div>
              <p className="text-gray-600 mb-4">
                Please log in using the navigation menu to test authentication.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
