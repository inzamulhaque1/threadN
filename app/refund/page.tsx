"use client";

import {
  RefreshCw,
  Check,
  X,
  Clock,
  CreditCard,
  HelpCircle,
  Mail,
  MessageSquare,
  AlertCircle,
  Coins,
  Calendar,
  Shield,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 font-body">
      <Navbar showLinks={false} />

      {/* Hero */}
      <section className="py-12 sm:py-16 px-4 relative">
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 mb-5 sm:mb-6">
            <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 sm:mb-4 text-white">Refund Policy</h1>
          <p className="text-gray-400 text-sm sm:text-base font-accent mb-2">
            Fair and transparent. We want you to be completely satisfied.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 font-accent">
            Last updated: January 29, 2026
          </p>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Our Promise: 7-Day Money-Back Guarantee
            </h3>
            <p className="text-gray-300 mb-4">
              Not happy with ThreadN? Get a full refund within 7 days of your first payment. No questions asked, no hoops to jump through.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Full refund within 7 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">No questions asked</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Processed within 5-10 business days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">

            {/* Eligible Refunds */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Check className="w-6 h-6 text-green-400" />
                Eligible for Refund
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">First-Time Subscribers (7-Day Guarantee)</h4>
                    <p className="text-sm text-gray-400">
                      If this is your first paid subscription to ThreadN and you request a refund within 7 days of payment, you will receive a full refund. This applies to Starter, Pro, and Enterprise plans.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Service Outages</h4>
                    <p className="text-sm text-gray-400">
                      If ThreadN experiences significant downtime (&gt;24 hours) during your billing period that prevents you from using core features, you may be eligible for a prorated refund or account credit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Duplicate Charges</h4>
                    <p className="text-sm text-gray-400">
                      If you were accidentally charged twice for the same billing period, we will immediately refund the duplicate charge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Accidental Renewal</h4>
                    <p className="text-sm text-gray-400">
                      If your subscription auto-renewed and you contact us within 48 hours of the renewal charge without having used the service during the new period, we will process a full refund.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Not Eligible */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <X className="w-6 h-6 text-red-400" />
                Not Eligible for Refund
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">After 7-Day Period</h4>
                    <p className="text-sm text-gray-400">
                      Refund requests made more than 7 days after your initial payment are not eligible. You can still cancel your subscription to prevent future charges.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Coin Purchases</h4>
                    <p className="text-sm text-gray-400">
                      Coins purchased for additional generations are non-refundable once added to your account. Coins do not expire but cannot be converted back to cash.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Terms Violations</h4>
                    <p className="text-sm text-gray-400">
                      Accounts terminated for violating our Terms of Service (spam, abuse, prohibited content) are not eligible for any refund.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Repeat Refund Requests</h4>
                    <p className="text-sm text-gray-400">
                      The 7-day guarantee applies to your first subscription only. If you previously received a refund and re-subscribed, subsequent refund requests will be evaluated on a case-by-case basis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Dissatisfaction with AI Output</h4>
                    <p className="text-sm text-gray-400">
                      We cannot guarantee specific results from AI-generated content. &quot;Virality scores&quot; are estimates, not guarantees. Refunds are not provided simply because generated content didn&apos;t perform as hoped.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Request */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-purple-400" />
                How to Request a Refund
              </h2>
              <div className="text-gray-300 space-y-6 leading-relaxed">
                <p>Requesting a refund is simple. Follow these steps:</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Send an Email</h4>
                      <p className="text-sm text-gray-400">
                        Email <a href="mailto:support@launchory.org" className="text-purple-400 hover:text-purple-300">support@launchory.org</a> with the subject line &quot;Refund Request&quot;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Include Required Information</h4>
                      <p className="text-sm text-gray-400">
                        Provide your account email address and the reason for your refund request (optional but helpful)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Wait for Confirmation</h4>
                      <p className="text-sm text-gray-400">
                        We&apos;ll review your request and respond within 24-48 hours with confirmation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Receive Your Refund</h4>
                      <p className="text-sm text-gray-400">
                        Approved refunds are processed within 5-10 business days to your original payment method
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation vs Refund */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6">Cancellation vs. Refund</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Cancellation
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                      <span>Stops future billing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                      <span>Keep access until end of billing period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                      <span>No money returned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                      <span>Can cancel anytime from settings</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Refund
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5" />
                      <span>Money returned to you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5" />
                      <span>Account reverts to Free plan immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5" />
                      <span>Only within 7 days (first subscription)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5" />
                      <span>Must contact support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-400" />
                Processing Time
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Payment Method</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Processing Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Credit/Debit Card</td>
                        <td className="py-3 px-4 text-cyan-400">5-10 business days</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">PayPal</td>
                        <td className="py-3 px-4 text-cyan-400">3-5 business days</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Bank Transfer</td>
                        <td className="py-3 px-4 text-cyan-400">5-14 business days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500">
                  Note: Processing times depend on your financial institution. ThreadN initiates refunds within 48 hours of approval.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="font-medium">Can I get a partial refund?</span>
                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 text-sm text-gray-400">
                    For service outages, we offer prorated refunds based on downtime. For standard refund requests, we provide full refunds within the 7-day window or no refund after that period.
                  </div>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="font-medium">What happens to my content after a refund?</span>
                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 text-sm text-gray-400">
                    Your account will revert to the Free plan. You&apos;ll retain access to basic features and your saved content, but premium features will be disabled.
                  </div>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="font-medium">Can I upgrade again after getting a refund?</span>
                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 text-sm text-gray-400">
                    Yes, you can subscribe again at any time. However, the 7-day money-back guarantee only applies to your first subscription.
                  </div>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="font-medium">Do you offer refunds for annual plans?</span>
                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 text-sm text-gray-400">
                    Yes, annual plans also have a 7-day money-back guarantee from the date of purchase. After 7 days, annual subscriptions are non-refundable but can be cancelled to prevent renewal.
                  </div>
                </details>
              </div>
            </div>

            {/* Contact */}
            <div className="glass-card p-8 bg-gradient-to-r from-green-500/10 to-cyan-500/10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6 text-green-400" />
                Need Help?
              </h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Our support team is here to help with any refund questions or issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@launchory.org"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-green-400" />
                    support@launchory.org
                  </a>
                </div>
                <p className="text-sm text-gray-500">
                  Average response time: Less than 24 hours
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
