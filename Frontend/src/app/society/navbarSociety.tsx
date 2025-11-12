import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { ProtectedRoute } from "@/components/protectedRoute";

export default function NavbarSociety() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <nav className="bg-white/70 backdrop-blur-md shadow-sm px-4 sm:px-6 lg:px-12 rounded-xl lg:rounded-full sticky top-4 sm:top-8 z-50">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          <Link
            href="/society/"
            className="font-bold text-lg sm:text-xl hover:opacity-80 transition-opacity duration-200"
          >
            Job<span className="text-orange-600 italic">Seeker</span>
          </Link>
          <ul className="hidden lg:flex space-x-10 font-medium">
            <li>
              <Link
                href="/society/"
                className="hover:text-orange-600 transition-colors duration-200 hover:scale-105 inline-block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/society/profile"
                className="hover:text-orange-600 transition-colors duration-200 hover:scale-105 inline-block"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/society/portfolio"
                className="hover:text-orange-600 transition-colors duration-200 hover:scale-105 inline-block"
              >
                Portofolio
              </Link>
            </li>
            <li>
              <Link
                href="/society/find-jobs"
                className="hover:text-orange-600 transition-colors duration-200 hover:scale-105 inline-block"
              >
                Find Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/society/my-applications"
                className="hover:text-orange-600 transition-colors duration-200 hover:scale-105 inline-block"
              >
                My Applications
              </Link>
            </li>
          </ul>
          <div className="hidden lg:flex items-center space-x-4">
            <p className="border border-black rounded-full px-4 py-2 font-medium">
              Society
            </p>
            <button
              onClick={logout}
              className="bg-black text-white font-semibold px-4 py-2 rounded-full hover:bg-red-700 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 relative z-50 hover:scale-110 transition-transform duration-200"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-black transition-all duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-black transition-all duration-300 ease-in-out ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-black transition-all duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu with Smooth Animation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-4 pt-2 space-y-3">
            <ul className="space-y-2 font-medium">
              {[
                { label: "Home", href: "/society/" },
                { label: "Profile", href: "/society/profile", isRoute: true },
                { label: "Portfolio", href: "/society/portfolio" },
                { label: "Find Jobs", href: "/society/find-jobs" },
                { label: "My Applications", href: "/society/my-applications" },
              ].map((item, index) => (
                <li
                  key={item.label}
                  className={`transform transition-all duration-300 ease-out ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                  }}
                >
                  <a
                    href={!item.isRoute ? item.href : undefined}
                    onClick={() => {
                      if (item.isRoute) {
                        router.push(item.href);
                      }
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 hover:text-orange-600 hover:translate-x-2 transition-all duration-200 cursor-pointer rounded-lg hover:bg-orange-50 px-2"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div
              className={`flex flex-col space-y-2 pt-2 border-t border-gray-200 transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
            >
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="bg-black text-white font-semibold px-4 py-2 rounded-full hover:bg-red-700 hover:scale-105 transition-all duration-200 cursor-pointer text-sm w-full"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 backdrop-blur-sm lg:hidden -z-10 animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </ProtectedRoute>
  );
}
