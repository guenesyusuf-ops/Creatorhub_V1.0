import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import jwt from 'jsonwebtoken'
import path from 'path'

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://f1722b37e4364e5ab611384fce036e3f.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = 'creatorhub-media'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const auth = req.headers.authorization?.split(' ')[1]
  if (!auth) return res.status(401).json({ error: 'Unauthorized' })
  try { jwt.verify(auth, process.env.JWT_SECRET!) } catch { return res.status(401).json({ error: 'Invalid token' }) }

  const { fileName, fileType, creatorId, tab } = req.body
  if (!fileName || !fileType) return res.status(400).json({ error: 'fileName and fileType required' })

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const key = `creators/${creatorId || 'general'}/${tab || 'bilder'}/${Date.now()}_${safeName}`

  try {
    const signedUrl = await getSignedUrl(
      R2,
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: fileType,
      }),
      { expiresIn: 3600 } // 1 hour
    )

    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${key}`
      : `https://f1722b37e4364e5ab611384fce036e3f.r2.cloudflarestorage.com/${BUCKET}/${key}`

    return res.status(200).json({ signedUrl, key, publicUrl })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
