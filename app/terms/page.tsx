"use client";

import Link from "next/link";
import {
  FileText,
  Shield,
  AlertTriangle,
  Scale,
  Ban,
  CreditCard,
  RefreshCw,
  Mail,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 font-body">
      <Navbar showLinks={false} />

      {/* Hero */}
      <section className="py-12 sm:py-16 px-4 relative">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-5 sm:mb-6">
            <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 sm:mb-4 text-white">Terms of Service</h1>
          <p className="text-gray-400 text-sm sm:text-base font-accent mb-2">
            Please read these terms carefully before using ThreadN
          </p>
          <p className="text-xs sm:text-sm text-gray-500 font-accent">
            Last updated: January 29, 2026
          </p>
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
                Introduction & Agreement
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Welcome to ThreadN! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the ThreadN website, applications, and AI-powered content generation services (collectively, the &quot;Service&quot;).
                </p>
                <p>
                  By creating an account, accessing, or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Service.
                </p>
                <p>
                  ThreadN is operated by ThreadN Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </div>

            {/* Service Description */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-sm font-bold text-cyan-400">2</span>
                Service Description
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>ThreadN provides AI-powered content generation services including but not limited to:</p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                    <span>Viral hook generation with virality scoring (0-5 scale)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                    <span>Thread building with custom calls-to-action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                    <span>YouTube transcript extraction and content repurposing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                    <span>AI topic-based content generation with customizable style, tone, and audience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                    <span>Multi-platform formatting (Facebook, Twitter/X, LinkedIn, Instagram)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                    <span>Content scheduling, templates, favorites, collections, and sharing features</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Account Terms */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-sm font-bold text-green-400">3</span>
                Account Registration & Security
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>To access our Service, you must:</p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                    <span>Be at least 18 years old or have parental/guardian consent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                    <span>Provide accurate, current, and complete registration information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                    <span>Maintain the security of your password and account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                    <span>Notify us immediately of any unauthorized access</span>
                  </li>
                </ul>
                <p>
                  You are responsible for all activity that occurs under your account. We reserve the right to suspend or terminate accounts that violate these Terms.
                </p>
              </div>
            </div>

            {/* Acceptable Use */}
            <div className="glass-card p-8 border-red-500/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Ban className="w-6 h-6 text-red-400" />
                Prohibited Uses
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>You agree NOT to use ThreadN to:</p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                    <span>Generate spam, misleading, or deceptive content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                    <span>Create content that infringes on intellectual property rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                    <span>Produce hate speech, harassment, or content promoting violence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                    <span>Attempt to reverse engineer, hack, or disrupt the Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                    <span>Circumvent usage limits or abuse the coin/subscription system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                    <span>Share account credentials or resell access to the Service</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-300 text-sm">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Violation of these terms may result in immediate account termination without refund.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                Intellectual Property & Content Ownership
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  <strong className="text-white">Your Content:</strong> You retain ownership of the content you input into ThreadN (transcripts, topics, ideas). You also own the generated output (hooks, threads) for your personal and commercial use.
                </p>
                <p>
                  <strong className="text-white">Our Platform:</strong> ThreadN, including its AI models, algorithms, design, code, and branding, remains our exclusive intellectual property. You may not copy, modify, or distribute any part of our platform.
                </p>
                <p>
                  <strong className="text-white">License Grant:</strong> By using ThreadN, you grant us a limited license to process your input content solely for the purpose of providing the Service. We do not claim ownership of your content or use it to train our AI models without explicit consent.
                </p>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-green-400" />
                Subscription & Payment Terms
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  <strong className="text-white">Free Tier:</strong> Limited access with 1 thread per day and basic features. No credit card required.
                </p>
                <p>
                  <strong className="text-white">Paid Plans:</strong> Starter ($9/month), Pro ($19/month), and Enterprise ($49/month) plans offer increased limits and premium features. Prices are in USD and subject to applicable taxes.
                </p>
                <p>
                  <strong className="text-white">Billing Cycle:</strong> Subscriptions are billed monthly in advance. Your subscription will auto-renew unless cancelled before the renewal date.
                </p>
                <p>
                  <strong className="text-white">Coins:</strong> Additional generation credits can be purchased or earned through achievements. Coins do not expire but are non-transferable and non-refundable.
                </p>
              </div>
            </div>

            {/* Refunds */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-cyan-400" />
                Cancellation & Refunds
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  You may cancel your subscription at any time from your account settings. Upon cancellation:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                    <span>You retain access until the end of your current billing period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                    <span>No partial refunds for unused time within a billing period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                    <span>Your data will be retained for 30 days, then permanently deleted</span>
                  </li>
                </ul>
                <p>
                  For our full refund policy, please see our <Link href="/refund" className="text-purple-400 hover:text-purple-300 underline">Refund Policy</Link>.
                </p>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-yellow-400" />
                Disclaimers & Limitations
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  <strong className="text-white">AI-Generated Content:</strong> ThreadN uses AI to generate content suggestions. While we strive for quality, we cannot guarantee that generated content will be accurate, appropriate, or achieve specific results (including &quot;virality&quot;). Virality scores are estimates based on patterns, not guarantees.
                </p>
                <p>
                  <strong className="text-white">Service Availability:</strong> We aim for 99.9% uptime but do not guarantee uninterrupted access. The Service is provided &quot;as is&quot; without warranties of any kind.
                </p>
                <p>
                  <strong className="text-white">Limitation of Liability:</strong> To the maximum extent permitted by law, ThreadN shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                </p>
                <p>
                  <strong className="text-white">Third-Party Services:</strong> Our YouTube transcript extraction relies on third-party APIs. We are not responsible for changes to these services that may affect functionality.
                </p>
              </div>
            </div>

            {/* Changes & Termination */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-400">8</span>
                Changes & Termination
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We reserve the right to modify or discontinue the Service at any time. We will provide reasonable notice of significant changes via email or in-app notification.
                </p>
                <p>
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="glass-card p-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6 text-purple-400" />
                Contact Us
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@launchory.org"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-purple-400" />
                    support@launchory.org
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer showCTA={false} />
    </div>
  );
}
