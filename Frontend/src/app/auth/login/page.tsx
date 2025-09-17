'use client';
import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success && result.user) {
        // Redirect based on role
        if (result.user.role === 'HRD') {
          router.push('/hrd');
        } else {
          router.push('/society');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex space-x-28">
      {/* Left Side */}
      <div className="flex-3/5 pt-8 ps-12">
        {/* Header */}
        <header className="flex justify-between w-full font-bold text-xl">
          <Link href="/">
            Job<span className="text-orange-600 italic">Seeker</span>
          </Link>
          <p className="border border-black rounded-full px-3 py-1 text-sm font-medium">
            SignIn
          </p>
        </header>

        {/* Welcoming Text */}
        <div className="flex flex-col justify-center items-start mt-12">
          <h1 className="text-4xl font-bold">
            Welcome back, Hero!
          </h1>
          <h1 className="text-4xl font-bold text-orange-600">
            Time to get back on the quest!
          </h1>
          <p className="mt-4 text-lg max-w-2xl">
            Ready to keep exploring, applying, and building your future? Log in and let’s find (or post) the perfect job together!
          </p>
        </div>

        {/* Registration Form */}
        <div className="flex mt-12">
          <div className="border rounded-lg w-full p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <div className="flex-1">
                  <label htmlFor="email" className="block mb-1">
                    Your magic email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                    placeholder="Ex. John Doe"
                  />
                </div>
                <div className="flex-1 mt-8">
                  <label htmlFor="password" className="block mb-1">
                      Shh.. your secret password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                      placeholder="Ex. johndoe123"
                    />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white font-medium px-4 py-1 rounded cursor-pointer hover:bg-gray-800 transition"
              >
                {loading ? "Signing In" : "SignIn"}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-2/5 pt-8 pe-12">
        <div className="flex flex-col justify-start items-center h-full relative">
          <div className="absolute flex flex-col items-center">
            {/* Profile Auth */}
            <img src="/images/ProfileAuth.svg" alt="Profile Auth Image" />
            {/* Bubble Text */}
            <div className="bg-black text-white px-4 py-2 rounded-full font-semibold absolute top-60 left-0">
              <p>Search Active Jobs</p>
            </div>
            <div className="bg-orange-600 text-white px-4 py-2 rounded-full font-semibold absolute top-80 right-25">
              <p>Build Your Portofolio</p>
            </div>
            <div className="bg-black text-white px-4 py-2 rounded-full font-semibold absolute top-105 left-10">
              <p>Search Active Jobs</p>
            </div>
            {/* Quote */}
            <div className="bg-orange-600 text-white px-4 py-3 rounded">
              <p>
                The <strong>worst</strong> day working on{" "}
                <strong>your purpose</strong> will still be{" "}
                <strong>better</strong> than the <strong>best day</strong>{" "}
                working on something that <strong>isn’t your purpose</strong>.
              </p>
              <p className="mt-8">Julian Blanc</p>
            </div>
          </div>
          {/* Blob */}
          <svg
            viewBox="0 0 160 200"
            xmlns="http://www.w3.org/2000/svg"
            className=""
          >
            <path
              fill="#FA4B1B"
              d="M44.6,-50.6C59.8,-40.4,75.4,-28.3,82.5,-11.2C89.5,5.9,87.9,27.9,76.7,41.4C65.5,55,44.6,60.2,24.6,67.4C4.6,74.6,-14.6,83.9,-28.1,78.4C-41.5,73,-49.2,52.9,-56.3,35.2C-63.4,17.4,-69.8,2,-67.5,-12C-65.1,-26,-54,-38.5,-41.3,-49.2C-28.6,-59.8,-14.3,-68.5,0.2,-68.8C14.7,-69.1,29.4,-60.9,44.6,-50.6Z"
              transform="translate(70 70)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}