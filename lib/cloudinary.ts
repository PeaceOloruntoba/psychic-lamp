import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Generates a signature for a signed, direct-from-browser Cloudinary upload.
 * The Admin image uploader calls the `/api/cloudinary-signature` route
 * (see app/api/cloudinary-signature/route.ts) to get this, then uploads
 * straight to Cloudinary — the file never passes through our server.
 */
export function generateUploadSignature(paramsToSign: Record<string, unknown>) {
  return cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
}

export async function deleteCloudinaryImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

/** Extracts the Cloudinary public_id from a full delivery URL. */
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?([^.]+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}
