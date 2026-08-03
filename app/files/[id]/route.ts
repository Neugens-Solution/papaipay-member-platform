import { get } from "@vercel/blob";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/guards";

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120) || "document";
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const file = await db.fileAsset.findUnique({
    where: { id },
    select: {
      objectKey: true,
      originalFilename: true,
      contentType: true,
      manualKycDocuments: { select: { submission: { select: { member: { select: { userId: true } } } } }, take: 1 },
      paymentReceipts: { select: { member: { select: { userId: true } } }, take: 1 },
    },
  });
  if (!file) return new Response("Not found", { status: 404 });

  const isActiveAdmin = user.sessionAccountType === "admin" && user.adminProfile?.status === "Active";
  const ownsKycFile = file.manualKycDocuments.some((document) => document.submission.member.userId === user.id);
  const ownsPaymentReceipt = file.paymentReceipts.some((payment) => payment.member.userId === user.id);
  if (!isActiveAdmin && !ownsKycFile && !ownsPaymentReceipt) return new Response("Forbidden", { status: 403 });

  const privateBlobToken = process.env.PRIVATE_BLOB_READ_WRITE_TOKEN;
  if (!privateBlobToken) return new Response("Private document storage is not configured", { status: 503 });

  const result = await get(file.objectKey, { access: "private", useCache: false, token: privateBlobToken });
  if (!result || result.statusCode !== 200 || !result.stream) return new Response("Not found", { status: 404 });

  return new Response(result.stream, {
    headers: {
      "Content-Type": file.contentType || result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${safeFilename(file.originalFilename)}"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
