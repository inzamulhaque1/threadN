"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui";

interface FooterProps {
  showCTA?: boolean;
}

export function Footer({ showCTA = true }: FooterProps) {
  return (
    <footer className="relative pt-12 sm:pt-20 pb-8 sm:pb-10 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-950 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        {/* Top Section - Newsletter/CTA */}
        {showCTA && (
          <div className="glass-card p-5 sm:p-8 mb-10 sm:mb-16 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-bold mb-1 sm:mb-2">Ready to go viral?</h3>
                <p className="text-sm sm:text-base text-gray-400 font-accent">
                  Join thousands of creators using ThreadN to grow their audience.
                </p>
              </div>
              <Link href="/register" className="w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto whitespace-nowrap group">
                  Start Free Today
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand - Takes 2 columns */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="mb-3 sm:mb-4">
              <Image
                src="/logo.png"
                alt="ThreadN"
                width={140}
                height={40}
                className="h-8 sm:h-10 w-auto"
              />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
              AI-powered viral content generation. Transform any content into
              engagement-driving threads in seconds.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="#"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-blue-500/50 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-blue-600/50 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-pink-500/50 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Product</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link
                  href="/#features"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-500" />
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-500" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-500" />
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-500" />
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Features - Hidden on smallest screens */}
          <div className="hidden sm:block">
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Features</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <span className="text-gray-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" />
                  Hook Generator
                </span>
              </li>
              <li>
                <span className="text-gray-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" />
                  Thread Builder
                </span>
              </li>
              <li>
                <span className="text-gray-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" />
                  YouTube Extraction
                </span>
              </li>
              <li>
                <span className="text-gray-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" />
                  Smart Scheduling
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-pink-500" />
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-pink-500" />
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-pink-500" />
                  Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Support - Hidden on smallest screens */}
          <div className="hidden sm:block">
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="mailto:support@launchory.org"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
              <span>&copy; {new Date().getFullYear()} ThreadN.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm order-1 sm:order-2">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/refund"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Refunds
              </Link>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500 order-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
