import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  newsSchema,
  pageSchema,
  partnerSchema,
  personSchema,
  publicationSchema,
} from './content/schemas.ts';
import { byLanguage, unique } from './content/unique.ts';

const MARKDOWN = '**/*.md';

const partners = defineCollection({
  loader: unique(file('src/content/partners.yaml'), ['name', 'order']),
  schema: ({ image }) => partnerSchema(image()),
});

const publications = defineCollection({
  loader: file('src/content/publications.yaml'),
  schema: publicationSchema,
});

const people = defineCollection({
  loader: unique(glob({ pattern: MARKDOWN, base: './src/content/people' }), ['name', 'order'], byLanguage),
  schema: ({ image }) => personSchema(image()),
});

const news = defineCollection({
  loader: glob({ pattern: MARKDOWN, base: './src/content/news' }),
  schema: ({ image }) => newsSchema(image()),
});

const pages = defineCollection({
  loader: glob({ pattern: MARKDOWN, base: './src/content/pages' }),
  schema: pageSchema,
});

export const collections = { partners, publications, people, news, pages };
