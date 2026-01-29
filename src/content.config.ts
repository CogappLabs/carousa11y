import { defineCollection, z } from 'astro:content'

const carousels = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    wcagStatus: z.enum(['pass', 'minor', 'fail']),
    fixesApplied: z.array(z.string()).optional(),
  }),
})

export const collections = { carousels }
