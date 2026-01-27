import { Metadata } from "next";
import dbConnect from "@/lib/db";
import { SharedCard } from "@/models";
import SharePageClient from "./SharePageClient";

interface Props {
  params: Promise<{ id: string }>;
}

// Generate metadata for OG tags
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    await dbConnect();
    const sharedCard = await SharedCard.findOne({ uniqueId: id }).select("title description uniqueId");

    if (!sharedCard) {
      return {
        title: "Card Not Found | ThreadN",
        description: "This shared card could not be found.",
      };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://threadn.launchory.org";
    const imageUrl = `${appUrl}/api/share/${id}/image`;
    const shareUrl = `${appUrl}/share/${id}`;

    return {
      title: `${sharedCard.title} | ThreadN`,
      description: sharedCard.description || "Created with ThreadN - AI-powered content creation",
      openGraph: {
        title: sharedCard.title,
        description: sharedCard.description || "Created with ThreadN - AI-powered content creation",
        url: shareUrl,
        siteName: "ThreadN",
        images: [
          {
            url: imageUrl,
            width: 1080,
            height: 1080,
            alt: sharedCard.title,
          },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: sharedCard.title,
        description: sharedCard.description || "Created with ThreadN - AI-powered content creation",
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Shared Card | ThreadN",
      description: "View this shared card created with ThreadN",
    };
  }
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  return <SharePageClient shareId={id} />;
}
