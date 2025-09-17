"use client";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-12 pt-6">
        <div className="flex items-center space-x-1 font-bold text-xl">
          <span>
            Job<span className="text-orange-600 italic">Seeker</span>
          </span>
        </div>
        <div className="flex space-x-3">
          <p className="border border-black rounded-full px-3 py-1 text-sm font-medium">
            Find Your Match
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-col justify-between items-center flex-1 px-12 mt-12 md:mt-0">
        <div className="text-center">
          <div className="text-2xl">
            <span className="text-orange-600 font-black">—</span> Welcome to,
          </div>
          <h1 className="text-5xl font-bold mt-1">
            Job<span className="text-orange-600 italic">Seeker</span>
          </h1>
          <p className="mt-1 text-lg max-w-6xl mx-auto">
            Whether you’re on the hunt for your dream job or looking to discover
            your next superstar, you’re in the right place!
          </p>
        </div>

        {/* Buttons */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white py-2 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 min-w-[100vw] xl:min-w-[300px]">
            <Link href={"/auth/register"} className="flex items-center bg-black text-white hover:text-black hover:border px-4 xl:px-8 py-2 xl:py-4 rounded-full sm:text-xl xl:text-2xl hover:bg-white transition cursor-pointer">
              Sign me up!
              <span className="ml-3 w-8 h-8 flex items-center justify-center bg-orange-600 rounded-full text-white font-bold text-2xl">
                →
              </span>
            </Link>
            <Link href={"/auth/login"} className="bg-white border text-black hover:text-white px-4 xl:px-8 py-2 xl:py-4 rounded-full sm:text-xl xl:text-2xl hover:bg-black transition cursor-pointer">
              Have an account?
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-wrap justify-between w-full mt-6">
          {/* Left + Right (side by side on mobile, stacked on desktop) */}
          <div className="flex flex-col md:flex-row w-full lg:w-auto order-none lg:order-1">
            {/* Left */}
            <div className="flex-1 flex flex-col justify-around items-start md:pr-8 mt-12 min-h-[400px]">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-orange-600 text-6xl font-bold mr-2">
                    “
                  </span>
                  <span className="sr-only">Quote</span>
                </div>
                <div className="text-left text-lg">
                  Your next big opportunity is just a click away!
                  <br />
                  Find the job you love, or hire the talent you need — all in
                  one place!
                  <br />
                  Ready to change your future?
                </div>
                <div className="mt-2 text-lg">Let’s get started!</div>
              </div>

              <div className="flex flex-col">
                <span className="text-orange-500 font-bold">
                  1500+ Reviews
                  <span className="font-bold text-gray-800 ml-1">
                    (4.9 of 5)
                  </span>
                </span>
                <div className="text-xs text-gray-400">
                  Reviews from Valued Users
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex-1 flex flex-col justify-around md:items-end lg:pl-8 space-y-3 mt-18 md:mt-12 min-h-[300px] md:min-h-[300px] order-none lg:order-3">
              <div className="flex flex-col xs:flex-row md:flex-col md:items-end space-y-3 xs:space-y-0 md:space-y-3 xs:space-x-3 md:space-x-0">
                <div className="flex flex-col xxs:flex-row xxs:space-x-3 space-y-3 xxs:space-y-0">
                  <button className="bg-black text-white px-4 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-gray-800 transition">
                    Find Job
                  </button>
                  <button className="bg-orange-600 text-white px-5 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-orange-600 transition">
                    Build Your Portfolio
                  </button>
                </div>
                <div className="flex flex-col xxs:flex-row space-x-3">
                  <button className="bg-black text-white px-5 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-gray-800 transition">
                    No Boring Form, Promise
                  </button>
                </div>
                <div className="flex flex-col xxs:flex-row space-x-3">
                  <button className="bg-orange-600 text-white px-5 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-orange-600 transition">
                    Easy for Companies
                  </button>
                </div>
              </div>

              <div className="flex flex-col xxs:flex-row xxs:space-x-3 space-y-3 xxs:space-y-0 mt-12 xxs:mt-0">
                <button className="bg-black text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-gray-800 transition">
                  Match
                </button>
                <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-orange-600 transition">
                  Apply
                </button>
                <button className="bg-black text-white px-6 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-gray-800 transition">
                  Hired
                </button>
              </div>
            </div>

            {/* Center Image Desktop */}
            <div className="hidden relative flex-1 xl:flex flex-col justify-end items-center mt-18 md:mt-0 order-none lg:order-2">
              <div className="absolute lg:flex justify-center items-center z-0 w-[30vw]">
                <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#FA4B1B"
                    d="M44.6,-50.6C59.8,-40.4,75.4,-28.3,82.5,-11.2C89.5,5.9,87.9,27.9,76.7,41.4C65.5,55,44.6,60.2,24.6,67.4C4.6,74.6,-14.6,83.9,-28.1,78.4C-41.5,73,-49.2,52.9,-56.3,35.2C-63.4,17.4,-69.8,2,-67.5,-12C-65.1,-26,-54,-38.5,-41.3,-49.2C-28.6,-59.8,-14.3,-68.5,0.2,-68.8C14.7,-69.1,29.4,-60.9,44.6,-50.6Z"
                    transform="translate(70 100)"
                  />
                </svg>
              </div>
              <img
                src="/images/homeImage.svg"
                alt="Profile"
                className="relative z-10 w-[60vw] md:w-[40vw]"
              />
            </div>
          </div>

          {/* Center Image Under Desktop Size*/}
          <div className="flex relative flex-1 xl:hidden flex-col justify-end items-center mt-18 md:mt-0 order-none lg:order-2">
            <div className="absolute lg:flex justify-center items-center z-0 w-[40vw]">
              <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#FA4B1B"
                  d="M44.6,-50.6C59.8,-40.4,75.4,-28.3,82.5,-11.2C89.5,5.9,87.9,27.9,76.7,41.4C65.5,55,44.6,60.2,24.6,67.4C4.6,74.6,-14.6,83.9,-28.1,78.4C-41.5,73,-49.2,52.9,-56.3,35.2C-63.4,17.4,-69.8,2,-67.5,-12C-65.1,-26,-54,-38.5,-41.3,-49.2C-28.6,-59.8,-14.3,-68.5,0.2,-68.8C14.7,-69.1,29.4,-60.9,44.6,-50.6Z"
                  transform="translate(70 100)"
                />
              </svg>
            </div>
            <img
              src="/images/homeImage.svg"
              alt="Profile"
              className="relative z-10 w-[60vw] md:w-[40vw]"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white px-12 py-4">
        <div className="flex flex-wrap lg:justify-between items-center space-x-6 text-base lg:text-lg xl:text-xl font-medium">
          <span className="flex items-center">
            <span className="mx-2 w-1 h-1 bg-orange-500 rounded-full inline-block" />
            Find Job Fast
          </span>
          <span className="flex items-center">
            <span className="mx-2 w-1 h-1 bg-orange-500 rounded-full inline-block" />
            Build Awesome Portfolio
          </span>
          <span className="flex items-center">
            <span className="mx-2 w-1 h-1 bg-orange-500 rounded-full inline-block" />
            No Boring Form, Promise
          </span>
          <span className="flex items-center">
            <span className="mx-2 w-1 h-1 bg-orange-500 rounded-full inline-block" />
            Easy for Companies
          </span>
        </div>
      </footer>
    </div>
  );
}
