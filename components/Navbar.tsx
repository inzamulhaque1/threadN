"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ChevronRight, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui";

interface NavbarProps {
  showLinks?: boolean;
}

export function Navbar({ showLinks = true }: NavbarProps) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="ThreadN"
              width={140}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          {showLinks && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/#features"
                className="text-gray-400 hover:text-white transition-colors text-sm font-accent"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-400 hover:text-white transition-colors text-sm font-accent"
              >
                How It Works
              </Link>
              <Link
                href="/#pricing"
                className="text-gray-400 hover:text-white transition-colors text-sm font-accent"
              >
                Pricing
              </Link>
            </div>
          )}

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm" className="group">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 border-t border-white/10 mt-2 pt-4">
            {showLinks && (
              <div className="flex flex-col gap-3 mb-4">
                <Link
                  href="/#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm py-2"
                >
                  Features
                </Link>
                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm py-2"
                >
                  How It Works
                </Link>
                <Link
                  href="/#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm py-2"
                >
                  Pricing
                </Link>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full group">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="glass" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
