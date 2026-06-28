# Vercel Blob setup for Listing Management media

The listing media uploader uses the official `@vercel/blob` SDK from server-side code only. Admin-selected Hero and Gallery images are uploaded to a public Vercel Blob store, and the app stores only `FileAsset` metadata in Postgres.

## Required package and environment

- Package: `@vercel/blob`
- Required server environment variable: `BLOB_READ_WRITE_TOKEN`

No client-side Blob token is required because uploads are performed by the existing server action after Admin submits Save Draft or Publish.

## Create and attach a Blob Store

1. Open the Vercel Dashboard and select the PAPAIPAY project.
2. Go to **Storage** in the project sidebar.
3. Choose **Create Database** / **Create Store**, then select **Blob**.
4. Select **Public** access for listing media, because member and admin pages render image URLs directly.
5. Name the store, choose the preferred region, and create it.
6. When prompted, connect/attach the store to this Vercel project and select the environments that need uploads, typically Production, Preview, and Development.

Vercel automatically injects `BLOB_READ_WRITE_TOKEN` for selected environments when the store is connected to the project. For local development, run `vercel env pull .env.local` after the store is connected.

## Obtain or verify `BLOB_READ_WRITE_TOKEN`

- In Vercel Dashboard: open the project, then **Settings → Environment Variables**, and verify `BLOB_READ_WRITE_TOKEN` exists for the deployment environments used by Admin.
- If it is missing, reconnect the Blob store to the project/environments or add the read-write token from the Blob store settings as `BLOB_READ_WRITE_TOKEN`.
- Keep this token server-side only. Do not expose it with a `NEXT_PUBLIC_` prefix.

## Permissions and project settings

- The Vercel user attaching the store needs a role that can manage project storage/environment variables.
- The Blob store must be connected to the same project/environment where Admin uploads are performed.
- The store access mode should be **Public** for current member/admin direct image rendering.
- No Prisma migration or extra database permission is required.

## Verification checklist after configuration

1. Install dependencies so `@vercel/blob` is present.
2. Deploy/restart the app with `BLOB_READ_WRITE_TOKEN` available.
3. In Admin Listing Management, create or edit a listing.
4. Upload a Hero image under 5MB in JPG/JPEG/PNG/WEBP format and Save Draft.
5. Upload one or more Gallery images under 5MB in JPG/JPEG/PNG/WEBP format and Save Draft.
6. Re-open Edit Listing and confirm saved Hero/Gallery previews reload.
7. Publish the listing with and without media to confirm media does not block publishing.
8. Open Admin Listing Detail and confirm saved images render, or `No media uploaded yet` appears if none exist.
9. Open Member Opportunities card/detail pages and confirm the Hero/Gallery images render, or the neutral `Image pending` placeholder appears if no media exists.
