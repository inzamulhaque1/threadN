"use client";

import { useEffect, useState } from "react";
import { Download, Copy, Check, Eye, Twitter, Facebook, Linkedin, Share2 } from "lucide-react";
import Link from "next/link";

interface SharedCardData {
  uniqueId: string;
  imageData: string;
  title: string;
  description: string;
  templateName: string;
  views: number;
  createdAt: string;
}

interface SharePageClientProps {
  shareId: string;
}

export default function SharePageClient({ shareId }: SharePageClientProps) {
  const [card, setCard] = useState<SharedCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCard();
  }, [shareId]);

  const fetchCard = async () => {
    try {
      const res = await fetch(`/api/share/${shareId}`);
      const data = await res.json();

      if (data.success) {
        setCard(data.data.card);
      } else {
        setError(data.error || "Card not found");
      }
    } catch {
      setError("Failed to load card");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!card) return;

    const link = document.createElement("a");
    link.download = `${card.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
    link.href = card.imageData;
    link.click();
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareUrl = () => `${window.location.origin}/share/${shareId}`;

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${card?.title} - Check it out!`);
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${card?.title} - Check it out! ${getShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Card Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "This shared card could not be found."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition"
          >
            Go to ThreadN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-white">ThreadN</span>
          </Link>
          <Link
            href="/dashboard/templates"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm hover:opacity-90 transition"
          >
            Create Your Own
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Preview */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <img
                src={card.imageData}
                alt={card.title}
                className="w-full rounded-2xl shadow-2xl shadow-purple-500/20"
              />
            </div>

            {/* View Count */}
            <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              <span>{card.views} views</span>
            </div>
          </div>

          {/* Card Info & Actions */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-2">{card.title}</h1>
            {card.description && (
              <p className="text-gray-400 mb-6">{card.description}</p>
            )}
            {card.templateName && (
              <p className="text-sm text-purple-400 mb-6">Template: {card.templateName}</p>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition mb-4"
            >
              <Download className="w-5 h-5" />
              Download Image
            </button>

            {/* Copy Link */}
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl mb-6">
              <input
                type="text"
                value={getShareUrl()}
                readOnly
                className="flex-1 bg-transparent text-gray-300 text-sm outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share on social media
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={shareToTwitter}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 text-[#1DA1F2] rounded-xl font-medium transition"
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </button>
                <button
                  onClick={shareToFacebook}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/30 text-[#1877F2] rounded-xl font-medium transition"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </button>
                <button
                  onClick={shareToLinkedIn}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/30 text-[#0A66C2] rounded-xl font-medium transition"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </button>
                <button
                  onClick={shareToWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-[#25D366] rounded-xl font-medium transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-white font-medium mb-2">Create your own content cards</p>
              <p className="text-gray-400 text-sm mb-3">
                Use ThreadN to generate viral hooks and threads, then create beautiful shareable cards.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm hover:opacity-90 transition"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          Made with ThreadN - AI-powered content creation
        </div>
      </footer>
    </div>
  );
}
