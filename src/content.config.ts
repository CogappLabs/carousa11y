import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'

const carousels = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    wcagStatus: z.enum(['pass', 'minor', 'fail']),
    fixesApplied: z.array(z.string()).optional(),
  }),
})

export const collections = { carousels }
