import API from "./api";

// Auth helpers mapped to backend OpenAPI (/v1/auth)
export async function login(email: string, password: string) {
  // OAuth2 token endpoint — backend expects form data for password grant
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);
  params.append("grant_type", "password");
  const res = await API.post("/v1/auth/login", params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
}

export async function tokenLogin(username: string, password: string) {
  // OAuth2 token endpoint — backend expects form data for password grant
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  params.append("grant_type", "password");
  const res = await API.post("/v1/auth/login", params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
}

export async function createUser(payload: { username: string; email: string; password: string }) {
  // CreateUserRequest requires username, email, and password
  // The backend may return validation errors if fields are invalid
  const res = await API.post("/v1/auth/register", {
    username: payload.username,
    email: payload.email || payload.username, // use username as email if not provided
    password: payload.password,
    // Some backends may require a user_type field
    user_type: "photographer",
  });
  return res.data;
}

export async function refresh(body: { refresh_token: string }) {
  const res = await API.post("/v1/auth/refresh", body);
  return res.data;
}

export async function me() {
  const res = await API.get("/v1/auth/me");
  return res.data;
}

export async function logout() {
  try {
    await API.post("/v1/auth/logout");
  } catch (e) {
    // ignore if not implemented
  }
}

export async function getAllUsers() {
  const res = await API.get("/v1/auth/users");
  return res.data;
}

export async function updateUserRole(userId: string, role: string) {
  const res = await API.put(`/v1/auth/users/${userId}/role`, { role });
  return res.data;
}
