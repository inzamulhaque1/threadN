"use client";

import {
  Shield,
  Eye,
  Database,
  Lock,
  Share2,
  Cookie,
  Globe,
  UserCheck,
  Mail,
  Server,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 font-body">
      <Navbar showLinks={false} />

      {/* Hero */}
      <section className="py-12 sm:py-16 px-4 relative">
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-5 sm:mb-6">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 sm:mb-4 text-white">Privacy Policy</h1>
          <p className="text-gray-400 text-sm sm:text-base font-accent mb-2">
            Your privacy matters. Here&apos;s how we protect your data.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 font-accent">
            Last updated: January 29, 2026
          </p>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/20">
            <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Privacy at a Glance
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                <span className="text-gray-300">We never sell your personal data</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                <span className="text-gray-300">Your content stays yours</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                <span className="text-gray-300">You can delete your data anytime</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                <span className="text-gray-300">Encrypted data transmission</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                <span className="text-gray-300">No AI training on your content</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                <span className="text-gray-300">GDPR & CCPA compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">

            {/* Introduction */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">1</span>
                Introduction
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  ThreadN Inc. (&quot;ThreadN,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered content generation service.
                </p>
                <p>
                  By using ThreadN, you consent to the data practices described in this policy. If you do not agree with our policies, please do not use our Service.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-cyan-400" />
                Information We Collect
              </h2>
              <div className="text-gray-300 space-y-6 leading-relaxed">
                <div>
                  <h3 className="text-white font-semibold mb-2">Account Information</h3>
                  <p className="mb-2">When you register for ThreadN, we collect:</p>
                  <ul className="list-none space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                      <span>Email address (required for account creation)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                      <span>Name (optional, for personalization)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                      <span>Profile image (if using Google OAuth)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                      <span>Password (securely hashed using bcrypt)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Content You Provide</h3>
                  <p className="mb-2">When using our content generation features:</p>
                  <ul className="list-none space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                      <span>Text content you paste for hook/thread generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                      <span>YouTube URLs for transcript extraction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                      <span>Topics and preferences for AI-generated content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                      <span>Generated hooks, threads, and templates you save</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                      <span>Notes and tags you add to favorites/collections</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Usage Data</h3>
                  <p className="mb-2">We automatically collect:</p>
                  <ul className="list-none space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                      <span>Generation counts (hooks, threads created)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                      <span>Feature usage (scheduling, templates, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                      <span>Streak and achievement progress</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                      <span>API usage for cost tracking and rate limiting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-purple-400" />
                How We Use Your Information
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>We use collected information to:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-2">Provide Services</h4>
                    <p className="text-sm text-gray-400">Generate hooks and threads, process your content, deliver scheduled posts</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-2">Improve Experience</h4>
                    <p className="text-sm text-gray-400">Personalize recommendations, track streaks, unlock achievements</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-2">Communicate</h4>
                    <p className="text-sm text-gray-400">Send service updates, respond to support requests, share feature announcements</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-2">Maintain Security</h4>
                    <p className="text-sm text-gray-400">Prevent abuse, enforce rate limits, protect against unauthorized access</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI & Content Processing */}
            <div className="glass-card p-8 border-purple-500/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Server className="w-6 h-6 text-purple-400" />
                AI Processing & Your Content
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  <strong className="text-white">How AI Processing Works:</strong> When you generate content, your input is sent to OpenAI&apos;s GPT-4 API for processing. This is necessary to provide the hook generation and thread building features.
                </p>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-purple-300 text-sm">
                    <strong>Important:</strong> We do NOT use your content to train our AI models. Your input is processed in real-time and is subject to OpenAI&apos;s data usage policies. OpenAI does not use API data for training by default.
                  </p>
                </div>
                <p>
                  <strong className="text-white">YouTube Transcripts:</strong> When you provide a YouTube URL, we extract the transcript using YouTube&apos;s caption system. We do not store the video or full transcript permanently - only the generated outputs you choose to save.
                </p>
                <p>
                  <strong className="text-white">Content Retention:</strong> Generated content (hooks, threads) is stored in your account history for the duration specified by your plan (30/90/365 days). You can delete content at any time.
                </p>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Share2 className="w-6 h-6 text-cyan-400" />
                Data Sharing & Third Parties
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>We share your information only in these limited circumstances:</p>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Server className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Service Providers</h4>
                      <p className="text-sm text-gray-400">OpenAI (AI processing), MongoDB Atlas (database), payment processors (Paddle/Stripe)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Legal Requirements</h4>
                      <p className="text-sm text-gray-400">When required by law, subpoena, or to protect our rights and safety</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Public Sharing (Your Choice)</h4>
                      <p className="text-sm text-gray-400">Share cards you create are publicly accessible via unique links - this is optional</p>
                    </div>
                  </div>
                </div>
                <p className="text-green-400 font-medium mt-4">
                  We NEVER sell your personal information to advertisers or data brokers.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-yellow-400" />
                Cookies & Tracking
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>We use cookies and similar technologies for:</p>
                <ul className="list-none space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-medium">Essential</span>
                    <span>Authentication cookies to keep you logged in (HttpOnly, Secure)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">Functional</span>
                    <span>Preferences and settings (theme, dashboard layout)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs font-medium">Analytics</span>
                    <span>Anonymous usage statistics to improve the service (can be opted out)</span>
                  </li>
                </ul>
                <p>
                  You can control cookies through your browser settings. Disabling essential cookies may affect your ability to use ThreadN.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-green-400" />
                Data Security
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>We implement industry-standard security measures:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="text-green-400 font-medium mb-1">Encryption</h4>
                    <p className="text-sm text-gray-400">TLS 1.3 for all data in transit, encrypted database connections</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="text-green-400 font-medium mb-1">Password Security</h4>
                    <p className="text-sm text-gray-400">Bcrypt hashing with salt, never stored in plain text</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="text-green-400 font-medium mb-1">Access Control</h4>
                    <p className="text-sm text-gray-400">Role-based permissions, JWT authentication, rate limiting</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="text-green-400 font-medium mb-1">Infrastructure</h4>
                    <p className="text-sm text-gray-400">Secure cloud hosting with regular security updates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-purple-400" />
                Your Privacy Rights
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>Depending on your location, you may have the following rights:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-1">Access</h4>
                    <p className="text-sm text-gray-400">Request a copy of your personal data</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-1">Correction</h4>
                    <p className="text-sm text-gray-400">Update inaccurate personal information</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-1">Deletion</h4>
                    <p className="text-sm text-gray-400">Request permanent deletion of your data</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-1">Portability</h4>
                    <p className="text-sm text-gray-400">Export your data in a machine-readable format</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-1">Objection</h4>
                    <p className="text-sm text-gray-400">Opt out of certain data processing activities</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-medium mb-1">Withdraw Consent</h4>
                    <p className="text-sm text-gray-400">Revoke previously given consent at any time</p>
                  </div>
                </div>
                <p className="mt-4">
                  To exercise these rights, contact us at <a href="mailto:support@launchory.org" className="text-purple-400 hover:text-purple-300">support@launchory.org</a>. We will respond within 30 days.
                </p>
              </div>
            </div>

            {/* International */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-cyan-400" />
                International Data Transfers
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  ThreadN operates globally. Your data may be transferred to and processed in countries other than your own, including the United States where our servers and service providers are located.
                </p>
                <p>
                  We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses where applicable.
                </p>
              </div>
            </div>

            {/* Children */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-sm font-bold text-pink-400">10</span>
                Children&apos;s Privacy
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  ThreadN is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a minor, please contact us immediately at <a href="mailto:support@launchory.org" className="text-purple-400 hover:text-purple-300">support@launchory.org</a>.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="glass-card p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6 text-cyan-400" />
                Contact Us
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  For privacy-related questions or to exercise your rights:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@launchory.org"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-cyan-400" />
                    support@launchory.org
                  </a>
                </div>
                <p className="text-sm text-gray-500">
                  We aim to respond to all privacy inquiries within 30 days.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer showCTA={false} />
    </div>
  );
}
