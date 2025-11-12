"use client";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  nameSchema,
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  roleSchema,
} from "@/utils/validation";
import InputField from "@/components/form/inputField";
import LoadingSpinner from "@/components/loadingSpinner";
import Link from "next/link";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "" | "HRD" | "Society";
};

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleFormSubmit = async (data: RegisterFormData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (result.success) {
        setSuccess(
          "Registration successful! Please login with your credentials."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
  } = useFormValidation({
    schemas: {
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
      role: roleSchema,
    },
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "" as "" | "HRD" | "Society",
    },
    onSubmit: handleFormSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <div className="min-h-screen bg-white px-12 py-8">
      <header className="flex flex-col xl:flex-row justify-between xl:items-center mb-12">
        <div className="flex justify-between items-center w-full mb-10 xl:mb-0">
          <Link href="/" className="font-bold text-2xl">
            Job<span className="text-orange-600 italic">Seeker</span>
          </Link>
          <p className="border border-black rounded-full px-3 py-1 text-sm font-medium">
            SignUp
          </p>
        </div>
        <div className="xl:hidden">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Hey there,{" "}
            <span className="text-orange-600 italic">
              job hunters & job givers!
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Sign up now and let’s make your perfect match easier, smarter, and a
            whole lot more fun.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side - Minimal Illustration */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="hidden xl:block">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Hey there,{" "}
              <span className="text-orange-600 italic">
                job hunters & job givers!
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sign up now and let’s make your perfect match easier, smarter, and
              a whole lot more fun.
            </p>
          </div>

          {/* Abstract Illustration */}
          <div className="relative h-96 flex items-center justify-center">
            {/* Background Shapes */}
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Large Circle */}
              <circle cx="200" cy="200" r="150" fill="#FED7AA" opacity="0.3" />

              {/* Medium Circle */}
              <circle cx="280" cy="150" r="80" fill="#FB923C" opacity="0.2" />

              {/* Small Decorative Circles */}
              <circle cx="120" cy="120" r="40" fill="#EA580C" opacity="0.15" />
              <circle cx="300" cy="280" r="50" fill="#9A3412" opacity="0.1" />

              {/* Abstract Lines */}
              <path
                d="M100,200 Q200,150 300,200"
                stroke="#EA580C"
                strokeWidth="3"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M80,250 Q200,300 320,250"
                stroke="#FB923C"
                strokeWidth="2"
                fill="none"
                opacity="0.2"
              />

              {/* Dots */}
              <circle cx="150" cy="300" r="8" fill="#EA580C" />
              <circle cx="250" cy="100" r="6" fill="#FB923C" />
              <circle cx="350" cy="200" r="10" fill="#9A3412" opacity="0.5" />
            </svg>

            {/* Floating Tags */}
            <div className="absolute top-16 left-8 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
              💼 Career Growth
            </div>
            <div className="absolute top-32 right-12 bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
              🚀 Fast Hiring
            </div>
            <div className="absolute bottom-24 left-16 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
              ⭐ Top Companies
            </div>
            <div className="absolute bottom-32 right-8 bg-black text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
              💡 Dream Jobs
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">98%</p>
              <p className="text-xs text-gray-600">Success Rate</p>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">24h</p>
              <p className="text-xs text-gray-600">Avg. Response</p>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">50K+</p>
              <p className="text-xs text-gray-600">Happy Users</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="order-1 lg:order-2">
          <form
            className="space-y-12 border p-8 rounded-lg"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              {/* Nama */}
              <div className="flex-1">
                <InputField
                  id="name"
                  name="name"
                  label="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name ? errors.name : undefined}
                  placeholder="Ex. John Doe"
                />
              </div>

              {/* Email */}
              <div className="flex-1 mt-8">
                <InputField
                  id="email"
                  name="email"
                  label="Your magic email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : undefined}
                  placeholder="Ex. johndoe@email.com"
                />
              </div>

              {/* Password & Confirm Password pakai GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
                <div>
                  <InputField
                    id="password"
                    name="password"
                    type="password"
                    label="Shh.. your secret password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password ? errors.password : undefined}
                    placeholder="Ex. johndoe123"
                  />
                </div>
                <div>
                  <InputField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm your secret password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmPassword
                        ? errors.confirmPassword
                        : undefined
                    }
                    placeholder="Ex. johndoe123"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="flex-1 mt-8">
                <label
                  htmlFor="role"
                  className="block mb-1 text-sm md:text-base font-medium"
                >
                  Pick your superpower
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 bg-transparent outline-none py-2 text-sm"
                >
                  <option value="" disabled hidden>
                    I wanna be a...
                  </option>
                  <option value="Society">Society</option>
                  <option value="HRD">HRD</option>
                </select>
                {touched.role && errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-medium px-4 py-1 rounded cursor-pointer hover:bg-gray-800 transition mb-5"
            >
              {loading ? "Creating account..." : "SignUp!"}
            </button>

            {/* Link Login */}
            <div className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
