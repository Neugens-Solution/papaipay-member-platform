import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import {
  isSafeListingImagePathname,
  maxImageBytes,
  supportedImageMimeTypes,
} from "@/lib/storage/listingImagePath";

// Issues short-lived tokens so the admin browser can upload listing images
// straight to Vercel Blob, bypassing the 4.5MB function request body limit.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        await requireAdminPermission("listing.manage");
        const campaignId = clientPayload ?? "";
        const campaign = campaignId
          ? await db.campaign.findUnique({ where: { id: campaignId }, select: { slug: true } })
          : null;
        if (!campaign) throw new Error("Save Overview before uploading media.");
        if (!isSafeListingImagePathname(pathname, campaign.slug)) {
          throw new Error("Invalid image upload path.");
        }
        return {
          allowedContentTypes: [...supportedImageMimeTypes],
          maximumSizeInBytes: maxImageBytes,
          addRandomSuffix: false,
          cacheControlMaxAge: 31536000,
        };
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
