import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  newsSchema,
  pageSchema,
  partnerSchema,
  personSchema,
  publicationSchema,
} from './content/schemas.ts';

const MARKDOWN = '**/*.md';

const partners = defineCollection({
  loader: file('src/content/partners.yaml'),
  schema: ({ image }) => partnerSchema(image()),
});

const publications = defineCollection({
  loader: file('src/content/publications.yaml'),
  schema: publicationSchema,
});

const people = defineCollection({
  loader: glob({ pattern: MARKDOWN, base: './src/content/people' }),
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
