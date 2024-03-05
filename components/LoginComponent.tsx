"use client";
import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";

const LoginComponent = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
  };

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getUserRole = async (userEmail: string) => {
    let { data, error } = await supabase
      .from("account")
      .select("role")
      .eq("email", userEmail)
      .single();

    if (error) {
      console.error("Error fetching user details:", error);
      return null;
    }

    return data;
  };

  const handleAuth = async (e: any) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { data: existingUsers, error: existingUserError } = await supabase
          .from("account")
          .select("email")
          .eq("email", formData.email);

        if (existingUserError) {
          toast({
            title: "Error",
            description: existingUserError.message,
          });
          return;
        }

        if (existingUsers.length > 0) {
          toast({
            title: "Registration Error",
            description: "An account with this email already exists.",
          });
          return;
        }

        const { data: signUp, error: errorsignUp } = await supabase.auth.signUp(
          {
            email: formData.email,
            password: formData.password,
          }
        );

        const { data: addUser, error: errorAddUser } = await supabase
          .from("account")
          .insert([
            {
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
            },
          ]);
        if (errorsignUp || errorAddUser) {
          toast({
            title: "Registration Error",
            description: errorsignUp?.message || errorAddUser?.message,
          });
        }
        toast({
          title: "Registration Successful",
          description: "You have successfully registered!",
        });
        isSignUp && !errorsignUp && !errorAddUser && toggleSignUp();
      } else if (isForgotPassword) {
        console.log(formData.email);
        await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: "https://comporth-alerts.vercel.app/resetPassword",
        });
        toast({
          title: "Password Reset Request Sent",
          description: "Check your email to reset your password.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        console.log(data);

        if (error) {
          toast({
            title: "Login Error",
            description: error.message,
          });
        } else if (data) {
          if (data.user.email) {
            const userDetails = await getUserRole(data.user.email);

            if (!userDetails || userDetails.role === "pending") {
              toast({
                title: userDetails ? "Login Pending" : "Error",
                description: userDetails
                  ? "Your account is pending approval."
                  : "Unable to fetch user details.",
              });
            }
          } else {
            toast({
              title: "Login Successful",
              description: "You have successfully logged in.",
            });
            localStorage.clear();
            useRouter().push("/home");
          }
        }
      }
    } catch (error) {}
  };

  if (isForgotPassword) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className=" text-center text-2xl font-bold  tracking-tight text-gray-900">
            Forgot Password
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white p-4 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-2" action="#" method="POST" onSubmit={handleAuth}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm ">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500 "
                    onClick={toggleForgotPassword}
                  >
                    Back to Sign In
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center  rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                 >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className=" text-center text-2xl font-bold  tracking-tight text-gray-900">
          {isSignUp ? "Sign up" : "Sign in"}
        </h2>
        <div className="bg-yellow-300 text-black px-4 py-2 rounded-md shadow">
          Please contact your administrator to use this application
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white p-4 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-2" onSubmit={handleAuth}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={7}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <div>
                <label
                  htmlFor="tel"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    onClick={toggleForgotPassword}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled
              >
                {isSignUp
                  ? "Sign Up"
                  : isForgotPassword
                  ? "Reset Password"
                  : "Sign In"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                onClick={toggleSignUp}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Not a member?{" "}
              <button
                onClick={toggleSignUp}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
