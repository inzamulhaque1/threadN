"use client";

import { useEffect, useState } from "react";
import { Download, Copy, Check, Eye, Share2 } from "lucide-react";
import Link from "next/link";

interface SharedCardData {
  uniqueId: string;
  imageData: string;
  title: string;
  description: string;
  threadBody: string;
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
  const getShareText = () => card?.title || "Check out this content!";

  const shareToTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&display=popup`, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${getShareText()} ${getShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToThreads = () => {
    const text = encodeURIComponent(`${getShareText()} ${getShareUrl()}`);
    window.open(`https://www.threads.net/intent/post?text=${text}`, "_blank");
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };

  const shareToReddit = () => {
    const title = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, "_blank");
  };

  const shareToPinterest = () => {
    const url = encodeURIComponent(getShareUrl());
    const description = encodeURIComponent(getShareText());
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&description=${description}`, "_blank");
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent(getShareText());
    const body = encodeURIComponent(`Check out this content: ${getShareUrl()}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
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
    <div className="min-h-screen bg-[#0a0a0f] font-body">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-heading font-bold text-white">ThreadN</span>
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
        <div className="grid md:grid-cols-2 gap-8 items-start">
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
          <div className="flex flex-col overflow-visible">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">{card.title}</h1>

            {/* Full Thread Content */}
            {card.threadBody && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 overflow-visible">
                <p className="text-sm text-gray-400 mb-2">Thread Content:</p>
                <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {card.threadBody}
                </div>
              </div>
            )}

            {card.templateName && (
              <p className="text-sm text-purple-400 mb-4">Template: {card.templateName}</p>
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
              <div className="grid grid-cols-3 gap-2">
                {/* Twitter/X */}
                <button
                  onClick={shareToTwitter}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">X</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={shareToFacebook}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-[#1877F2]/20 border border-white/10 hover:border-[#1877F2]/30 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">Facebook</span>
                </button>

                {/* Threads */}
                <button
                  onClick={shareToThreads}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.17.408-2.133 1.37-2.788.812-.552 1.86-.879 3.119-.974 1.053-.08 2.076-.05 3.063.088.016-.498.002-.987-.04-1.467-.094-1.037-.37-1.79-.82-2.234-.377-.372-.947-.567-1.695-.58h-.043c-.94 0-1.72.315-2.32.937-.513.528-.845 1.241-1.01 2.12l-2.002-.402c.252-1.273.776-2.318 1.556-3.106 1.006-1.016 2.322-1.533 3.912-1.54h.053c1.31.02 2.402.388 3.247 1.096.894.748 1.44 1.85 1.623 3.275.05.393.075.799.076 1.215.866.213 1.65.518 2.34.918 1.084.63 1.933 1.484 2.527 2.544.665 1.186.964 2.632.853 4.038-.158 2.027-1.085 3.812-2.606 5.02C18.207 23.105 15.705 24 12.186 24zm-.09-7.809c-.882 0-1.628.183-2.22.544-.521.319-.795.713-.769 1.108.028.42.283.786.719 1.028.523.29 1.187.434 1.974.429 1.085-.055 1.903-.441 2.432-1.147.43-.574.712-1.378.832-2.38a15.71 15.71 0 0 0-2.968-.582z"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">Threads</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareToLinkedIn}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 hover:border-[#0A66C2]/30 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">LinkedIn</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={shareToWhatsApp}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/30 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={shareToTelegram}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-[#0088cc]/20 border border-white/10 hover:border-[#0088cc]/30 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">Telegram</span>
                </button>

                {/* Reddit */}
                <button
                  onClick={shareToReddit}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-[#FF4500]/20 border border-white/10 hover:border-[#FF4500]/30 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FF4500]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">Reddit</span>
                </button>

                {/* Pinterest */}
                <button
                  onClick={shareToPinterest}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-[#E60023]/20 border border-white/10 hover:border-[#E60023]/30 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#E60023]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">Pinterest</span>
                </button>

                {/* Email */}
                <button
                  onClick={shareToEmail}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">Email</span>
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
