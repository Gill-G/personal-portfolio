// Content collections: typed Markdown content. Each project is one file in
// src/content/projects/. Files starting with "_" (like _template.md) are ignored.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string(),
    // Lower numbers show first.
    order: z.number().default(100),
    status: z.enum(['shipped', 'in-progress', 'concept']),
    tags: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
  }),
});

export const collections = { projects };
