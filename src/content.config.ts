// Content collections: typed Markdown content. Each project is one file in
// src/content/projects/. Files starting with "_" (like _template.md) are ignored.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  // `image` lets frontmatter point at an image file; Astro checks it exists and
  // optimizes it at build time.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      year: z.string(),
      // Lower numbers show first.
      order: z.number().default(100),
      // Optional. Leave it out to hide the status label on the card.
      status: z.enum(['shipped', 'in-progress', 'concept']).optional(),
      tags: z.array(z.string()).default([]),
      repo: z.url().optional(),
      demo: z.url().optional(),
      // Optional logo, shown in the card's art panel instead of the generated blob.
      // Path is relative to the project's .md file, e.g. ../../assets/projects/my-app.png
      logo: image().optional(),
    }),
});

export const collections = { projects };
