import type { AuthProvider } from "@refinedev/core";

import { BACKEND_BASE_URL } from "@/constants";

const API_BASE = BACKEND_BASE_URL.replace(/\/+$/, "");
const AUTH_BASE = `${API_BASE}/auth`;

type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string | null;
};

type SessionResponse = {
  user?: AuthUser;
  session?: unknown;
};

const parseErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

export const authProvider: AuthProvider = {
  login: async ({ email, password, providerName }) => {
    try {
      if (providerName) {
        const response = await fetch(`${AUTH_BASE}/sign-in/social`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            provider: providerName,
            callbackURL: window.location.origin,
          }),
        });

        if (!response.ok) {
          return {
            success: false,
            error: {
              name: "LoginError",
              message: await parseErrorMessage(response),
            },
          };
        }

        const payload = (await response.json().catch(() => ({}))) as {
          url?: string;
        };

        if (payload.url) {
          window.location.href = payload.url;
        }

        return {
          success: true,
          redirectTo: "/",
        };
      }

      const response = await fetch(`${AUTH_BASE}/sign-in/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: await parseErrorMessage(response),
          },
        };
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message:
            error instanceof Error ? error.message : "Unexpected login error",
        },
      };
    }
  },

  register: async ({ email, password, providerName }) => {
    try {
      if (providerName) {
        const response = await fetch(`${AUTH_BASE}/sign-in/social`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            provider: providerName,
            callbackURL: window.location.origin,
          }),
        });

        if (!response.ok) {
          return {
            success: false,
            error: {
              name: "RegisterError",
              message: await parseErrorMessage(response),
            },
          };
        }

        const payload = (await response.json().catch(() => ({}))) as {
          url?: string;
        };

        if (payload.url) {
          window.location.href = payload.url;
        }

        return {
          success: true,
          redirectTo: "/",
        };
      }

      const response = await fetch(`${AUTH_BASE}/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          name: email?.split("@")[0] || "New User",
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            name: "RegisterError",
            message: await parseErrorMessage(response),
          },
        };
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message:
            error instanceof Error ? error.message : "Unexpected register error",
        },
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const response = await fetch(`${AUTH_BASE}/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/login`,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            name: "ForgotPasswordError",
            message: await parseErrorMessage(response),
          },
        };
      }

      return {
        success: true,
        successNotification: {
          message: "Reset instructions sent",
          description:
            "If an account exists for that email, password reset instructions were sent.",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "ForgotPasswordError",
          message:
            error instanceof Error
              ? error.message
              : "Unexpected forgot-password error",
        },
      };
    }
  },

  logout: async () => {
    await fetch(`${AUTH_BASE}/sign-out`, {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    try {
      const response = await fetch(`${AUTH_BASE}/get-session`, {
        credentials: "include",
      });

      if (!response.ok) {
        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
        };
      }

      const payload = (await response.json()) as SessionResponse;
      const authenticated = Boolean(payload?.user && payload?.session);

      if (!authenticated) {
        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    } catch {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }
  },

  getIdentity: async () => {
    try {
      const response = await fetch(`${AUTH_BASE}/get-session`, {
        credentials: "include",
      });

      if (!response.ok) return null;
      const payload = (await response.json()) as SessionResponse;
      return payload.user ?? null;
    } catch {
      return null;
    }
  },

  onError: async () => {
    return { error: undefined };
  },
};
