import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'

export default defineConfig({
  site: 'https://cogapplabs.github.io',
  base: '/carousa11y',
  integrations: [
    react(),
    mdx({
      remarkPlugins: [[remarkToc, { heading: 'Contents', tight: false }]],
      rehypePlugins: [rehypeSlug],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
