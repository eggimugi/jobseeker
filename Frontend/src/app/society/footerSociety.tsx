import Link from "next/link";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function FooterSociety() {
  return (
    <footer className="text-black mt-20">
      <div>
        <Link href="/society/dashboard" className="font-bold text-xl">
          Job<span className="text-orange-600 italic">Seeker</span>
        </Link>
        <h1 className="text-4xl font-bold">
          Helping heroes find their quests{" "}
          <span className="text-orange-600 italic">since 2025</span>
        </h1>
        <p className="border-b text-gray-300 my-10" />

        <div className="flex justify-between">
          {/* left */}
          <div className="flex flex-col">
            <h2 className="font-bold text-lg mb-4">Quick jump to your next action!</h2>
            <Link href="#" className="mb-2 hover:underline">
              Home
            </Link>
            <Link href="#" className="mb-2 hover:underline">
              Profile
            </Link>
            <Link href="#" className="mb-2 hover:underline">
              Find Jobs
            </Link>
            <Link href="#" className="mb-2 hover:underline">
              My Applicants
            </Link>
          </div>

          {/* center */}
          <div className="flex flex-col ml-20">
            <h2 className="font-bold text-lg mb-4">Contact & info</h2>
            <div className="flex flex-col">
              <div className="flex mb-2">
                <Mail className="mr-2 w-5 font-light text-gray-800" />
                <span className="mb-2"> Need help? support@jobseeker.com </span>
              </div>
              <div className="flex mb-2">
                <Phone className="mr-2 w-5 font-light" />
                <span className="mb-2"> +62 812 3456 7890</span>
              </div>
              <div className="flex mb-2">
                <MapPin className="mr-2 w-5 font-light" />
                <span className="mb-2"> St. Danau Ranau No. 1 </span>
              </div>
              <div className="flex mb-2">
                <Calendar className="mr-2 w-5 font-light" />
                <span className="mb-2"> Mon–Fri, 9AM–6PM </span>
              </div>
            </div>
          </div>

          {/* right */}
          <div className="flex flex-col ml-20 justify-between">
            <h1 className="font-bold text-4xl mb-4">Your next quest, is just <br /><span className="text-orange-600 italic"> around the corner.</span></h1>
            <p>&copy; {new Date().getFullYear()} Jobseeker. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
