// app/api/register-artist/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeToken } from '@/sanity/lib/token'
import { artistFormSchema } from '@/lib/schemas/artist'
import { v4 as uuidv4 } from 'uuid'

// Helper function to detect platform from URL
const detectPlatform = (url: string): string => {
  const cleanUrl = url.toLowerCase()

  if (cleanUrl.includes('instagram.com')) return 'Instagram'
  if (cleanUrl.includes('soundcloud.com')) return 'SoundCloud'
  if (cleanUrl.includes('bandcamp.com')) return 'Bandcamp'
  if (cleanUrl.includes('spotify.com')) return 'Spotify'
  if (cleanUrl.includes('music.apple.com')) return 'Apple Music'
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be'))
    return 'YouTube'
  if (cleanUrl.includes('mixcloud.com')) return 'Mixcloud'
  if (cleanUrl.includes('residentadvisor.net')) return 'Resident Advisor'
  if (cleanUrl.includes('discogs.com')) return 'Discogs'
  if (cleanUrl.includes('beatport.com')) return 'Beatport'
  if (cleanUrl.includes('tiktok.com')) return 'TikTok'
  if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com'))
    return 'Twitter/X'
  if (cleanUrl.includes('facebook.com')) return 'Facebook'

  try {
    const domain = new URL(url).hostname.replace('www.', '')
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  } catch {
    return 'Website'
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()

    // Validate with Zod
    const validatedData = artistFormSchema.parse(rawData)

    // Prepare the document for Sanity
    const doc = {
      _type: 'artist',
      artistName: validatedData.artistName,
      pronouns: validatedData.pronouns,
      customPronouns: validatedData.customPronouns,
      email: validatedData.email,
      categories: validatedData.categories.map((id: string) => ({
        _type: 'reference',
        _ref: id,
        _key: uuidv4(),
      })),
      tags: validatedData.tags.map((id: string) => ({
        _type: 'reference',
        _ref: id,
        _key: uuidv4(),
      })),
      // Fix: Use _type: 'object' instead of _type: 'url'
      links: validatedData.links.map((url: string) => ({
        _key: uuidv4(),
        url: url,
        platform: detectPlatform(url),
      })),
      description: validatedData.description,
      approved: false,
    }

    await client.withConfig({ token: writeToken }).create(doc)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
