import Link from "next/link";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function FooterHRD() {
  return (
    <footer className="text-black mt-20 px-4 md:px-6 lg:px-8">
      <div>
        <Link href="/society/dashboard" className="font-bold text-xl">
          Job<span className="text-orange-600 italic">Seeker</span>
        </Link>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-4">
          Helping heroes find their quests{" "}
          <span className="text-orange-600 italic">since 2025</span>
        </h1>
        <p className="border-b text-gray-300 my-6 md:my-8 lg:my-10" />

        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-4">
          {/* left */}
          <div className="flex flex-col">
            <h2 className="font-bold text-base md:text-lg mb-3 md:mb-4">
              Quick jump to your next action!
            </h2>
            <Link
              href="/hrd/"
              className="mb-2 hover:underline text-sm md:text-base"
            >
              Home
            </Link>
            <Link
              href="/hrd/profile"
              className="mb-2 hover:underline text-sm md:text-base"
            >
              Company Profile
            </Link>
            <Link
              href="/hrd/positions"
              className="mb-2 hover:underline text-sm md:text-base"
            >
              Add Position
            </Link>
            <Link
              href="/hrd/applicants"
              className="mb-2 hover:underline text-sm md:text-base"
            >
              Applicants
            </Link>
          </div>

          {/* center */}
          <div className="flex flex-col lg:ml-20">
            <h2 className="font-bold text-base md:text-lg mb-3 md:mb-4">
              Contact & info
            </h2>
            <div className="flex flex-col">
              <div className="flex mb-2 items-start">
                <Mail className="mr-2 w-5 h-5 flex-shrink-0 font-light text-gray-800 mt-0.5" />
                <span className="text-sm md:text-base">
                  {" "}
                  Need help? support@jobseeker.com{" "}
                </span>
              </div>
              <div className="flex mb-2 items-start">
                <Phone className="mr-2 w-5 h-5 flex-shrink-0 font-light mt-0.5" />
                <span className="text-sm md:text-base"> +62 812 3456 7890</span>
              </div>
              <div className="flex mb-2 items-start">
                <MapPin className="mr-2 w-5 h-5 flex-shrink-0 font-light mt-0.5" />
                <span className="text-sm md:text-base">
                  {" "}
                  St. Danau Ranau No. 1{" "}
                </span>
              </div>
              <div className="flex mb-2 items-start">
                <Calendar className="mr-2 w-5 h-5 flex-shrink-0 font-light mt-0.5" />
                <span className="text-sm md:text-base"> Mon–Fri, 9AM–6PM </span>
              </div>
            </div>
          </div>

          {/* right */}
          <div className="flex flex-col lg:ml-20 justify-between">
            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4">
              Keep building <br />
              <span className="text-orange-600 italic">
                {" "}
                around the corner.
              </span>{" "}
              captain.
            </h1>
            <p className="text-sm md:text-base mt-6 lg:mt-0">
              &copy; {new Date().getFullYear()} Jobseeker. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
