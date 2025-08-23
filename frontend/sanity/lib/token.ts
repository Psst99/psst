import { write } from 'fs'
import 'server-only'

export const token = process.env.SANITY_API_READ_TOKEN
export const writeToken = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}
