import {loadEnvConfig} from '@next/env'
import {createClient} from '@sanity/client'

loadEnvConfig(process.cwd())

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28'
const token = process.env.SANITY_API_READ_TOKEN

export const emailSanityClient =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
      })
    : null
