"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useTransition } from "react";
import { setCookie } from "cookies-next";
import { setUser } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { AuthResponse } from "@/types/common"; 

/**
 * Interface for form data state
 */
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * SignInForm Component
 * 
 * Handles user authentication by capturing email and password inputs,
 * sending a sign-in request, handling responses, and managing authentication tokens.
 */
const SignInForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    email: "user@gmail.com",
    password: "mymovies",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  /**
   * Handles input changes for the form fields.
   * Utilizes useCallback to memoize the function and prevent unnecessary re-creations.
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  /**
   * Handles the form submission for user login.
   * Utilizes useCallback to memoize the function and prevent unnecessary re-creations.
   * Manages loading state using useTransition for a smooth user experience.
   */
  const handleLogin = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);

      // Start transition for loading state
      startTransition(async () => {
        try {
          const response = await axios.post<AuthResponse>("/api/auth/sign-in", {
            email: formData.email,
            password: formData.password,
          });

          if (response.status === 200) {
            const { token, user } = response.data.data;

            // Set authentication token as a cookie
            setCookie("token", token, {
              path: "/",
              maxAge: 60 * 60 * 24, // 1 day
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production",
            });

            // Dispatch user information to Redux store
            dispatch(setUser({ userId: user._id, email: user.email }));

            // Navigate to the home page
            router.replace("/");
          }
        } catch (err) {
          console.error("Login Error:", err);
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "An error occurred during login.");
          } else {
            setError("An unexpected error occurred during login.");
          }
        }
      });
    },
    [formData, dispatch, router]
  );

  return (
    <div className="w-full max-w-sm mx-auto mt-8 p-4 rounded-md">
      <form className="space-y-6" onSubmit={handleLogin} noValidate>
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            className="input-field"
            aria-required="true"
            aria-invalid={!!error}
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
            className="input-field"
            aria-required="true"
            aria-invalid={!!error}
          />
        </div>

        {/* Remember Me and SignUp Link */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 appearance-none bg-input checked:bg-green-500 rounded checked:border-transparent cursor-pointer"
              aria-label="Remember me"
            />
            <label htmlFor="remember-me" className="body-small">
              Remember me
            </label>
          </div>
          <Link
            href="/sign-up"
            className="body-small hover:underline hover:text-green-500"
          >
            Sign Up
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm mt-3" role="alert">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="custom-button py-3 hover:bg-green-500"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(SignInForm);
