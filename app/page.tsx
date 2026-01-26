"use client";

import Link from "next/link";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Shield,
  Users,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Hooks",
    description: "Generate 10 viral hooks from your content in seconds",
  },
  {
    icon: Zap,
    title: "Instant Threads",
    description: "Turn any hook into a complete, engaging thread",
  },
  {
    icon: TrendingUp,
    title: "Virality Scores",
    description: "Each hook rated for engagement potential",
  },
  {
    icon: Clock,
    title: "Save Hours",
    description: "What takes hours now takes seconds",
  },
  {
    icon: Shield,
    title: "Proven Patterns",
    description: "Based on viral content psychology",
  },
  {
    icon: Users,
    title: "Any Niche",
    description: "Works for any topic or industry",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Try it out",
    features: ["1 thread/day", "5 hook previews", "Basic support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "For growing creators",
    features: ["10 threads/day", "Full hook access", "30-day history", "Priority support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious creators",
    features: [
      "25 threads/day",
      "Full hook access",
      "90-day history",
      "Priority support",
      "Custom CTAs",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "For teams & agencies",
    features: [
      "100 threads/day",
      "Full hook access",
      "1-year history",
      "Dedicated support",
      "API access",
      "Team features",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="navbar-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold text-neon-gradient">ThreadN</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">AI-Powered Content Generation</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Turn Content Into{" "}
            <span className="text-neon-gradient">Viral Threads</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Generate scroll-stopping Facebook hooks and engagement-driving threads in
            seconds. No more staring at blank screens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Creating Free
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Go Viral
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Powerful features designed to help you create engaging content faster
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">Three simple steps to viral content</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Paste Your Content",
                description: "Add your transcript, notes, or ideas",
              },
              {
                step: "2",
                title: "Generate Hooks",
                description: "AI creates 10 viral hook options",
              },
              {
                step: "3",
                title: "Create Thread",
                description: "Pick a hook, get a full thread",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Fair Pricing</h2>
            <p className="text-gray-400">Start free, upgrade when you need more</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`glass-card p-6 relative ${
                  plan.popular ? "border-purple-500/50 ring-1 ring-purple-500/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="chip chip-neon">Most Popular</span>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-400">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    variant={plan.popular ? "neon" : "glass"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Viral Content?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of creators using ThreadN to grow their audience
          </p>
          <Link href="/register">
            <Button size="lg">
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <span className="font-bold text-neon-gradient">ThreadN</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/refund" className="hover:text-white transition-colors">
                Refund
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ThreadN. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
