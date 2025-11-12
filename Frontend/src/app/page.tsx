"use client";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-12 pt-6">
        <div className="font-bold text-xl">
          Job<span className="text-orange-600 italic">Seeker</span>
        </div>
        <div className="border border-black rounded-full px-3 py-1 text-sm font-medium">
          Find Your Match
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-between flex-1 px-12">
        {/* Hero Section */}
        <div className="text-center mt-6">
          <div className="text-2xl">
            <span className="text-orange-600 font-black">—</span> Welcome to,
          </div>
          <h1 className="text-5xl font-bold mt-1">
            Job<span className="text-orange-600 italic">Seeker</span>
          </h1>
          <p className="mt-1 text-lg max-w-6xl mx-auto">
            Whether you're on the hunt for your dream job or looking to discover
            your next superstar, you're in the right place!
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="xl:absolute bottom-16 flex flex-col sm:flex-row items-center gap-4 mt-12 z-11">
          <Link
            href="/auth/register"
            className="flex items-center bg-black text-white hover:bg-white hover:text-black hover:border px-8 py-4 rounded-full text-xl transition"
          >
            Sign me up!
            <span className="ml-3 w-8 h-8 flex items-center justify-center bg-orange-600 rounded-full text-white font-bold text-2xl">
              →
            </span>
          </Link>
          <Link
            href="/auth/login"
            className="bg-white border border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-full text-xl transition"
          >
            Have an account?
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-6">
          {/* Left Section */}
          <div className="flex flex-col justify-between min-h-[400px] pb-20">
            <div>
              <div className="text-orange-600 text-6xl font-bold">"</div>
              <p className="text-lg mt-2">
                Your next big opportunity is just a click away!
                <br />
                Find the job you love, or hire the talent you need — all in one
                place!
                <br />
                Ready to change your future?
              </p>
              <p className="mt-4 text-lg font-medium">Let's get started!</p>
            </div>

            <div className="mt-8">
              <div className="text-orange-500 font-bold">
                1500+ Reviews
                <span className="text-gray-800 ml-1">(4.9 of 5)</span>
              </div>
              <div className="text-xs text-gray-400">
                Reviews from Valued Users
              </div>
            </div>
          </div>

          {/* Center Section - Image */}
          <div className="relative flex justify-center items-end">
            <div className="absolute bottom-0 flex justify-center items-center">
              <svg
                viewBox="0 0 160 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-xs xl:w-sm"
              >
                <path
                  fill="#FA4B1B"
                  d="M44.6,-50.6C59.8,-40.4,75.4,-28.3,82.5,-11.2C89.5,5.9,87.9,27.9,76.7,41.4C65.5,55,44.6,60.2,24.6,67.4C4.6,74.6,-14.6,83.9,-28.1,78.4C-41.5,73,-49.2,52.9,-56.3,35.2C-63.4,17.4,-69.8,2,-67.5,-12C-65.1,-26,-54,-38.5,-41.3,-49.2C-28.6,-59.8,-14.3,-68.5,0.2,-68.8C14.7,-69.1,29.4,-60.9,44.6,-50.6Z"
                  transform="translate(70 100)"
                />
              </svg>
            </div>
            <img
              src="/images/homeImage.svg"
              alt="JobSeeker illustration"
              className="relative z-10 w-96"
            />
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex flex-col justify-between min-h-[400px] pb-20">
            <div className="flex flex-col items-end gap-3">
              <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                Find Job
              </button>
              <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-700 transition">
                Build Your Portfolio
              </button>
              <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                No Boring Form, Promise
              </button>
              <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-700 transition">
                Easy for Companies
              </button>
            </div>

            <div className="flex gap-3 justify-end">
              <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                Match
              </button>
              <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-700 transition">
                Apply
              </button>
              <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                Hired
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white px-12 py-4">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6 text-lg font-medium">
          <span className="flex items-center">
            <span className="w-1 h-1 bg-orange-500 rounded-full mr-2" />
            Find Job Fast
          </span>
          <span className="flex items-center">
            <span className="w-1 h-1 bg-orange-500 rounded-full mr-2" />
            Build Awesome Portfolio
          </span>
          <span className="flex items-center">
            <span className="w-1 h-1 bg-orange-500 rounded-full mr-2" />
            No Boring Form, Promise
          </span>
          <span className="flex items-center">
            <span className="w-1 h-1 bg-orange-500 rounded-full mr-2" />
            Easy for Companies
          </span>
        </div>
      </footer>
    </div>
  );
}
