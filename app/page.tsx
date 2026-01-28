"use client";

import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Calendar,
  Users,
  ChevronRight,
  Check,
  Youtube,
  FileText,
  Target,
  Flame,
  Trophy,
  Share2,
  FolderHeart,
  LayoutTemplate,
  MessageSquare,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  ArrowRight,
  Star,
  Heart,
  Lightbulb,
  PenTool,
  Bot,
  History,
  Coins,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const mainFeatures = [
  {
    icon: Sparkles,
    title: "AI Hook Generator",
    description:
      "Paste any content and get 10 scroll-stopping hooks instantly. Each hook is scored 0-5 for virality potential with evidence from your content explaining why it works.",
    highlight: "10 hooks + scores",
  },
  {
    icon: MessageSquare,
    title: "Thread Builder",
    description:
      "Pick your favorite hook and watch it transform into a complete thread with 5-7 numbered points, emojis, and your custom call-to-action. Ready to post.",
    highlight: "Custom CTAs",
  },
  {
    icon: Youtube,
    title: "YouTube to Content",
    description:
      "Drop any YouTube link and we extract the transcript automatically using 5 different fallback methods. Even works when captions are disabled.",
    highlight: "Auto-transcript",
  },
  {
    icon: Bot,
    title: "AI Topic Generator",
    description:
      "Just describe your topic and choose your style (informative, motivational, controversial), tone (professional, casual, bold), and target audience. AI creates the content for you.",
    highlight: "From idea to post",
  },
];

const platformFeatures = [
  {
    icon: Facebook,
    name: "Facebook",
    limit: "63,206 chars",
    description: "Full threads with emojis and compelling hooks",
  },
  {
    icon: Twitter,
    name: "Twitter/X",
    limit: "280 chars",
    description: "Auto-split into numbered tweet threads",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    limit: "3,000 chars",
    description: "Professional tone with 3-5 hashtags",
  },
  {
    icon: Instagram,
    name: "Instagram",
    limit: "2,200 chars",
    description: "Caption-ready with 20-30 hashtags",
  },
];

const workflowFeatures = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Plan your content calendar and schedule posts across all platforms. Set daily or weekly recurring posts and track publish status.",
  },
  {
    icon: LayoutTemplate,
    title: "Reusable Templates",
    description:
      "Save your winning formats as templates with variables like {{topic}} and {{audience}}. Share publicly or keep private. Track usage.",
  },
  {
    icon: FolderHeart,
    title: "Collections & Favorites",
    description:
      "Organize content into color-coded collections with custom icons. Add notes, tags, and find your best hooks instantly.",
  },
  {
    icon: Share2,
    title: "Share Cards",
    description:
      "Generate beautiful share cards with your content. Get a unique public link with rich OG previews for social sharing. Track views.",
  },
  {
    icon: Target,
    title: "A/B Hook Testing",
    description:
      "Generate hook variations using 5 emotional triggers (curiosity, fear, excitement, controversy, empathy) and 5 formats (question, statement, statistic, story, challenge).",
  },
  {
    icon: TrendingUp,
    title: "Google Trends",
    description:
      "See what's trending right now and create timely content. Ride the wave of what people are already searching for.",
  },
  {
    icon: History,
    title: "Generation History",
    description:
      "Full history of all your generations with filtering and pagination. Never lose a great hook - everything is saved automatically.",
  },
  {
    icon: Coins,
    title: "Coin System",
    description:
      "Run out of daily threads? Use coins for extra generations. Earn coins through achievements or redeem access codes.",
  },
];

const gamificationFeatures = [
  {
    icon: Flame,
    title: "Daily Streaks",
    description: "Track current streak, longest streak, and total days active. Daily resets keep you motivated.",
  },
  {
    icon: Trophy,
    title: "15+ Achievements",
    description: "Unlock achievements for generations, streaks (3, 7, 30 days), using features, and more. Earn XP and level up your creator rank.",
  },
];

const painPoints = [
  {
    before: "Staring at a blank screen for hours",
    after: "10 viral hooks with virality scores in seconds",
  },
  {
    before: "Manually transcribing YouTube videos",
    after: "Auto-extract transcripts from any YouTube link",
  },
  {
    before: "Reformatting content for each platform",
    after: "Auto-format for FB, Twitter, LinkedIn, Instagram",
  },
  {
    before: "Losing your best-performing hooks",
    after: "Collections, favorites, notes & tags",
  },
  {
    before: "Inconsistent posting schedule",
    after: "Schedule with daily/weekly recurrence",
  },
  {
    before: "Guessing what angle to use",
    after: "A/B test 5 emotional triggers & 5 formats",
  },
  {
    before: "Starting from scratch every time",
    after: "Reusable templates with variables",
  },
  {
    before: "No idea what's trending",
    after: "Google Trends integration built-in",
  },
];

const testimonials = [
  {
    quote:
      "I used to spend 2 hours writing one Facebook post. Now I get 10 scored hooks in seconds, pick the top one, and have a full thread in one click. The virality scores are surprisingly accurate.",
    author: "Sarah M.",
    role: "Content Creator",
    avatar: "S",
  },
  {
    quote:
      "The YouTube transcript feature is incredible. I drop a video link, get the transcript auto-extracted, and turn it into a LinkedIn thread. What took me a whole day now takes 5 minutes.",
    author: "Marcus J.",
    role: "YouTuber & Coach",
    avatar: "M",
  },
  {
    quote:
      "The A/B testing with different emotional triggers helped me understand what resonates with my audience. My engagement went up significantly once I started using the curiosity-based hooks.",
    author: "Priya K.",
    role: "Digital Marketer",
    avatar: "P",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out",
    features: [
      "1 thread per day",
      "10 hooks per generation",
      "Virality scores & evidence",
      "YouTube transcript extraction",
      "Basic history",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "For growing creators",
    features: [
      "10 threads per day",
      "All input modes (Text, YouTube, AI)",
      "30-day history",
      "Templates library",
      "Favorites & Collections",
      "Multi-platform formatting",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious content creators",
    features: [
      "25 threads per day",
      "A/B hook testing",
      "Smart scheduling",
      "Share cards with tracking",
      "Google Trends",
      "90-day history",
      "Streak & achievements",
      "All templates",
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
      "100 threads per day",
      "Everything in Pro",
      "1-year history",
      "API access",
      "Team collaboration",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

const inputModes = [
  {
    icon: FileText,
    title: "Paste Text",
    description: "Paste your transcript, notes, blog post, or any content directly",
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
  {
    icon: Youtube,
    title: "YouTube Link",
    description: "Drop any YouTube URL - we auto-extract the transcript",
    color: "text-red-400",
    bg: "bg-red-500/20",
  },
  {
    icon: Bot,
    title: "AI from Topic",
    description: "Just describe your topic - AI generates the content",
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
  },
];

const steps = [
  {
    step: "1",
    title: "Choose Input Mode",
    description:
      "Paste text, drop a YouTube link, or describe a topic. Set your style, tone, and target audience.",
    icon: FileText,
  },
  {
    step: "2",
    title: "Get 10 Scored Hooks",
    description:
      "AI generates 10 viral hooks, each scored 0-5 with reasoning and evidence from your content.",
    icon: Lightbulb,
  },
  {
    step: "3",
    title: "Build Your Thread",
    description:
      "Pick a hook, add your custom CTA, and get a complete thread with 5-7 numbered points and emojis.",
    icon: PenTool,
  },
  {
    step: "4",
    title: "Format & Schedule",
    description:
      "Auto-format for any platform, save to favorites, add to collections, or schedule for later.",
    icon: Calendar,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-32 px-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-xs sm:text-sm text-purple-300">
              Your AI Content Partner
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
            Stop Struggling to Write.
            <br />
            <span className="text-neon-gradient">Start Creating Viral Content.</span>
          </h1>

          <p className="font-accent text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            ThreadN turns your ideas, YouTube videos, articles, or any topic into
            <span className="font-mono text-purple-400"> 10 </span>viral hooks with virality scores, then builds complete threads with
            custom CTAs. Format for any platform. Schedule. Track. Grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group">
                Start Creating Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Works with any niche</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Powered by GPT-4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-12 sm:py-20 px-4 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-2 tracking-tight">
              Content Creation Shouldn&apos;t Feel Like a Chore
            </h2>
            <p className="font-accent text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-2">
              We get it. You have great ideas but turning them into engaging
              content is exhausting. Here&apos;s how ThreadN changes that.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className="glass-card p-4 sm:p-5 hover-lift group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <ArrowRight className="w-3 h-3 text-red-400 group-hover:text-green-400 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm line-through mb-1">
                      {point.before}
                    </p>
                    <p className="text-white font-medium text-sm sm:text-base">{point.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2 tracking-tight">
              Everything You Need to Create{" "}
              <span className="text-neon-gradient">Viral Content</span>
            </h2>
            <p className="font-accent text-sm sm:text-base text-gray-400 max-w-xl mx-auto px-2">
              From raw ideas to polished posts, ThreadN handles every step
              of your content workflow.
            </p>
          </div>

          {/* 3 Input Modes */}
          <div className="mb-10 sm:mb-16">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8">
              <span className="font-mono text-purple-400">3</span> Ways to Start Creating
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {inputModes.map((mode, index) => (
                <div
                  key={index}
                  className="glass-card p-5 sm:p-6 text-center hover-lift"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${mode.bg} flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    <mode.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${mode.color}`} />
                  </div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">{mode.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{mode.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Generation Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="glass-card p-5 sm:p-8 hover-lift">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-xl font-semibold">{feature.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                        {feature.highlight}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Support */}
          <div className="mb-10 sm:mb-16">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8">
              Optimized for Every Platform
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {platformFeatures.map((platform, index) => (
                <div
                  key={index}
                  className="glass-card p-4 sm:p-5 text-center hover-lift"
                >
                  <platform.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-purple-400" />
                  <h4 className="font-heading font-semibold mb-1 text-sm sm:text-base">{platform.name}</h4>
                  <p className="font-mono text-xs text-purple-300 mb-1 sm:mb-2">
                    {platform.limit}
                  </p>
                  <p className="font-accent text-xs sm:text-sm text-gray-400 hidden sm:block">{platform.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {workflowFeatures.map((feature, index) => (
              <div key={index} className="glass-card p-5 sm:p-6 hover-lift">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="font-accent text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* AI Customization */}
          <div className="glass-card p-5 sm:p-8 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 mb-10 sm:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="font-heading text-lg sm:text-xl font-semibold mb-2">
                Customize Your AI Content
              </h3>
              <p className="font-accent text-sm sm:text-base text-gray-400">
                When using AI Topic mode, fine-tune your content with these options
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <h4 className="font-heading font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Content Style</h4>
                <p className="font-accent text-gray-500 text-xs sm:text-sm">Informative, Motivational, Storytelling, Controversial, Humorous, Educational, Inspirational</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
                <h4 className="font-heading font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Tone</h4>
                <p className="font-accent text-gray-500 text-xs sm:text-sm">Professional, Casual, Friendly, Authoritative, Conversational, Bold & Direct</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                </div>
                <h4 className="font-heading font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Target Audience</h4>
                <p className="font-accent text-gray-500 text-xs sm:text-sm">General, Entrepreneurs, Professionals, Students, Creators, Marketers, Developers, Beginners</p>
              </div>
            </div>
          </div>

          {/* Gamification */}
          <div className="glass-card p-5 sm:p-8 bg-gradient-to-r from-orange-500/5 to-yellow-500/5">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="font-heading text-lg sm:text-xl font-semibold mb-2">
                Stay Motivated with Streaks & Achievements
              </h3>
              <p className="font-accent text-sm sm:text-base text-gray-400">
                Building a content habit is hard. We make it fun.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {gamificationFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold mb-1 text-sm sm:text-base">{feature.title}</h4>
                    <p className="font-accent text-gray-400 text-xs sm:text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-20 px-4 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2 tracking-tight">
              From Idea to Viral Post in <span className="font-mono text-purple-400">4</span> Steps
            </h2>
            <p className="font-accent text-sm sm:text-base text-gray-400 max-w-xl mx-auto px-2">
              No complicated setup. No learning curve. Just paste, generate, and
              publish.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-purple-500/50 to-transparent -translate-x-4" />
                )}
                <div className="glass-card p-4 sm:p-6 text-center hover-lift h-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="font-mono text-xs text-purple-400 mb-1 sm:mb-2">
                    Step {item.step}
                  </div>
                  <h3 className="font-heading text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{item.title}</h3>
                  <p className="font-accent text-gray-400 text-xs sm:text-sm hidden sm:block">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
              Loved by Content Creators
            </h2>
            <p className="font-accent text-sm sm:text-base text-gray-400">
              Join thousands of creators who&apos;ve transformed their content game
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-5 sm:p-6 hover-lift">
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="font-accent text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm sm:text-base">{testimonial.author}</p>
                    <p className="font-accent text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
              Simple Pricing, No Surprises
            </h2>
            <p className="font-accent text-sm sm:text-base text-gray-400">
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`glass-card p-5 sm:p-6 relative ${
                  plan.popular
                    ? "border-purple-500/50 ring-2 ring-purple-500/20"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="chip chip-neon text-xs font-heading">Most Popular</span>
                  </div>
                )}
                <h3 className="font-heading text-lg sm:text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="font-mono text-3xl sm:text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="font-accent text-gray-400 text-sm sm:text-base">{plan.period}</span>
                  )}
                </div>
                <p className="font-accent text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">{plan.description}</p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button
                    variant={plan.popular ? "neon" : "glass"}
                    className="w-full text-sm sm:text-base"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Money back guarantee */}
          <div className="text-center mt-8 sm:mt-12">
            <div className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-400">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="font-accent"><span className="font-mono">7</span>-day money-back guarantee. No questions asked.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 px-2 tracking-tight">
            Your Next Viral Post is One Click Away
          </h2>
          <p className="font-accent text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto px-2">
            Stop overthinking. Stop procrastinating. Start creating content that
            actually gets engagement.
          </p>
          <Link href="/register">
            <Button size="lg" className="group font-heading">
              Start Creating Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="font-accent text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
            Free forever. No credit card required.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
