/**
 * Authentication and API error handling utilities
 */

export class AuthError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "AuthError";
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Handle API errors consistently across the app
 */
export function handleAPIError(error: any): string {
  console.error("API Error:", error);
  
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      return "Authentication failed. Please log in again.";
    }
    if (status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (status === 404) {
      return "The requested resource was not found.";
    }
    if (status === 409) {
      return data?.detail || "This account already exists. Try logging in instead.";
    }
    if (status === 422) {
      // Validation error - extract message
      if (data?.detail) {
        if (Array.isArray(data.detail)) {
          return data.detail.map((d: any) => d.msg || d.message).join(", ");
        }
        return data.detail;
      }
      return "Invalid data submitted. Please check your input.";
    }
    if (status >= 500) {
      return "Server error. Please try again later.";
    }

    return data?.message || data?.detail || "An error occurred.";
  }

  if (error.request) {
    // Request made but no response - could be network or CORS issue
    console.error("No response received:", error.request);
    return "Unable to reach the server. Please check your internet connection and try again.";
  }

  // Something else happened
  return error.message || "An unexpected error occurred.";
}

/**
 * Check if user is authenticated by verifying token presence
 */
export function hasValidToken(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const token = localStorage.getItem("imfo_token");
    return !!token;
  } catch {
    return false;
  }
}

/**
 * Get stored token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem("imfo_token");
  } catch {
    return null;
  }
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("imfo_token");
    localStorage.removeItem("imfo_user");
  } catch {
    // Ignore errors
  }
}
