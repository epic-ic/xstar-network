import { reference } from 'astro:content';
import { z } from 'astro/zod';
import countries from 'i18n-iso-countries';

const COUNTRY_CODE = /^[A-Z]{2}$/;
const DOI = /^10\.\d{4,9}\/\S+$/;

const countryCode = z
  .string()
  .regex(COUNTRY_CODE)
  .refine((code) => countries.isValid(code), 'Not a country code. Use the ISO two-letter code, like GB or NG');

export const partnerSchema = (logo: z.ZodType) =>
  z.object({
    name: z.string(),
    country: countryCode,
    website: z.url().optional(),
    logo,
    order: z.int().positive().optional(),
  });

export const personSchema = (photo: z.ZodType) =>
  z.object({
    name: z.string(),
    role: z.string(),
    partner: reference('partners'),
    photo: photo.optional(),
    order: z.int().positive().optional(),
    past: z.boolean().default(false),
  });

export const newsSchema = (cover: z.ZodType) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    cover: z.object({ src: cover, alt: z.string() }).optional(),
    partners: z.array(reference('partners')).default([]),
  });

export const publicationSchema = z.object({
  doi: z.string().regex(DOI),
  countries: z.array(countryCode).default([]),
  viruses: z.array(z.string()).default([]),
});

export const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
});
