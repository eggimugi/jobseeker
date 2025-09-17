"use client";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import ProfileSociety from "./ProfileSociety";
import NavbarSociety from "./navbarSociety";
import PortofolioSociety from "./PortofolioSociety";
import ApplyJob from "./applyJob";
import ApplicantsHistory from "./applicantsHistory";
import FooterSociety from "./footerSociety";

export default function SocietyDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <div className="min-h-screen bg-white px-12 py-12">
        {/* Navbar */}
        <NavbarSociety />

        <main className="pt-10">
          {/* Header */}
          <header className="text-xl">
            <p>
              <span className="text-orange-600 text-2xl font-black">—</span>{" "}
              Home
            </p>
            <h1 className="text-4xl font-bold mt-2">
              Welcome back,{" "}
              <span className="text-orange-600 italic">{user?.name}!</span>
            </h1>
            <p className="mt-2">Ready to find your next quest? Let’s go!</p>
          </header>

          {/* Quick Stats */}
          <div className="mt-5 text-xl">
            <p className="font-bold">
              Here’s your{" "}
              <span className="text-orange-600 italic">adventure progress</span>{" "}
              so far:
            </p>
            <div className="flex justify-between px-8 py-4 bg-orange-600 mt-5 rounded">
              <ul className="flex gap-12">
                <li className="flex items-center">
                  <span className="font-bold text-white text-4xl">80%</span>
                  <span className="text-white ms-2 leading-5">
                    Portofolio <br /> completed
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="font-bold text-white text-4xl">5</span>
                  <span className="text-white ms-2 leading-5">
                    Applications <br /> Sent
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="font-bold text-white text-4xl">1</span>
                  <span className="text-white ms-2 leading-5">
                    Status <br /> Accepted
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="font-bold text-white text-4xl">3</span>
                  <span className="text-white ms-2 leading-5">
                    Still <br /> Waiting
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="font-bold text-white text-4xl">1</span>
                  <span className="text-white ms-2 leading-5">
                    Not <br /> This Time
                  </span>
                </li>
              </ul>
              <button className="border-2 border-white text-white rounded-full px-4 py-2 font-medium">
                More Details
              </button>
            </div>
          </div>

          {/* Profile */}
          <ProfileSociety />

          {/* Portofolio */}
          <PortofolioSociety />

          {/* Apply Job */}
          <ApplyJob />

          {/* Applicants History */}
          <ApplicantsHistory />

          {/* Footer */}
          <FooterSociety />
          
        </main>
      </div>
    </ProtectedRoute>
  );
}
