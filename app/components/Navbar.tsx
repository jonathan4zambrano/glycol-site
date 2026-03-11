import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-center w-full pt-4 px-6 bg-transparent">
      <div className="flex items-center justify-between gap-8 bg-white rounded-full px-5 py-3 shadow-lg">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/Navbar_Logo.png"
            alt="GlycoTech Logo"
            height={44}
            width={160}
            className="h-11 w-auto object-contain"
            unoptimized
          />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-7">
          <Link
            href="/#story"
            className="text-gray-500 hover:text-black text-sm font-medium transition-colors"
          >
            Story
          </Link>
          <Link
            href="/#vision"
            className="text-gray-500 hover:text-black text-sm font-medium transition-colors"
          >
            Vision
          </Link>
          <Link
            href="/login"
            className="text-gray-500 hover:text-black text-sm font-medium transition-colors"
          >
            Login
          </Link>
        </div>

        {/* CTA Button */}
        <Link
          href="/contact"
          className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-800 transition-colors shrink-0"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
