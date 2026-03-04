import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const REGION = "us-east-1"
const ENDPOINT = "https://s3.nevaobjects.id"

/** Default bucket – kept for presigned-URL backward compat */
const DEFAULT_BUCKET = "invitational"
/** Dedicated bucket for music tracks */
export const MUSIC_BUCKET = "list-music"
/** Background images for invitations */
export const BG_IMAGE_BUCKET = "list-images-bg"
/** Couple profile photos */
export const PROFILE_PHOTO_BUCKET = "list-photo-profile"
/** Gallery images uploaded by users */
export const GALLERY_BUCKET = "list-gallery-user"

const CLIENT = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: "XKFYKDLNYFETMIKZD67H",
    secretAccessKey: "zOFuu2RxX1nJIPsOcP8on2FBOIKJGAhgN1G0XVmG",
  },
  forcePathStyle: true,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Ensure a bucket exists and has a public-read policy. */
export async function ensureBucket(bucket: string) {
  // 1. Create bucket (ignore "already exists" errors)
  try {
    await CLIENT.send(new CreateBucketCommand({ Bucket: bucket }))
  } catch (err: unknown) {
    const code =
      (err as { Code?: string }).Code ??
      (err as { name?: string }).name ??
      ""
    if (code !== "BucketAlreadyOwnedByYou" && code !== "BucketAlreadyExists") {
      throw err
    }
  }

  // 2. Apply public-read bucket policy (idempotent — safe to call every time)
  const policy = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${bucket}/*`,
      },
    ],
  })

  await CLIENT.send(
    new PutBucketPolicyCommand({ Bucket: bucket, Policy: policy })
  )
}

/** Slugify a string to be safe for bucket/key names. */
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Derive the image bucket name from the couple's names. */
export function imageBucketName(groomName: string, brideName: string) {
  return `images-${slugify(groomName)}-${slugify(brideName)}`
}

/** Return the public URL for an object. */
export function getFileUrl(key: string, bucket: string = DEFAULT_BUCKET) {
  return `${ENDPOINT}/${bucket}/${key}`
}

// ─── Direct upload (server-side, no presign needed) ──────────────────────────

/**
 * Upload a file buffer directly to S3. Creates the bucket if it doesn't exist.
 * Returns the public URL.
 */
export async function uploadFile(
  bucket: string,
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
) {
  await ensureBucket(bucket)
  await CLIENT.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return getFileUrl(key, bucket)
}

// ─── Music helpers ────────────────────────────────────────────────────────────

export async function listMusic() {
  // Ensure bucket exists and has public-read policy (fixes pre-existing buckets too)
  await ensureBucket(MUSIC_BUCKET)
  try {
    const res = await CLIENT.send(
      new ListObjectsV2Command({ Bucket: MUSIC_BUCKET })
    )
    return (res.Contents ?? []).map((o) => getFileUrl(o.Key!, MUSIC_BUCKET))
  } catch {
    return []
  }
}

// ─── Presigned URL (legacy – used for photo proxy upload) ────────────────────

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: DEFAULT_BUCKET,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(CLIENT, command, { expiresIn: 300 })
}

/** @deprecated use uploadFile() via /api/s3/music-upload instead */
export async function getMusicUploadUrl(filename: string, contentType: string) {
  const key = `${Date.now()}-${filename}`
  return { key, uploadUrl: await getUploadUrl(key, contentType) }
}

