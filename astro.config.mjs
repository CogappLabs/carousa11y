import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'

export default defineConfig({
  // Update these for your GitHub Pages deployment
  // site: 'https://yourusername.github.io',
  // base: '/a11y-carousel',
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
