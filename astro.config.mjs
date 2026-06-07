import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'

const processor = unified({
  remarkPlugins: [[remarkToc, { heading: 'Contents', tight: false }]],
  rehypePlugins: [rehypeSlug],
})

export default defineConfig({
  site: 'https://cogapplabs.github.io',
  base: '/carousa11y',
  markdown: { processor },
  integrations: [react(), mdx({ processor })],
  vite: {
    plugins: [tailwindcss()],
  },
})
