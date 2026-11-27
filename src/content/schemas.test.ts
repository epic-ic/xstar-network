import { z } from 'astro/zod';
import { describe, expect, test } from 'vitest';
import { newsSchema, pageSchema, partnerSchema, personSchema, publicationSchema } from './schemas.ts';

// Astro's image() only exists during a build, so the schemas take it as an argument, and the tests pass a plain string instead.
const image = z.string();
const LOGO = '../assets/partners/imperial.png';

const partner = {
  name: 'Imperial College London',
  country: 'GB',
  website: 'https://www.imperial.ac.uk/',
  logo: LOGO,
};

const person = { name: 'Clare McCormack', role: 'Research Associate', partner: 'imperial' };

const post = {
  title: 'From London to Dakar: Science, Language and Collaboration in Multiplex Serology Training',
  date: '2025-11-01',
  summary: 'Training on multiplex serological assays at the Institut Pasteur de Dakar.',
};

const publication = { doi: '10.3791/69259' };

const page = {
  title: 'About Us',
  description: 'The project aims to better understand the infection burden of mosquito borne viruses (arboviruses) across Africa.',
};

describe('partners', () => {
  test('accepts a partner with every field', () => {
    expect(partnerSchema(image).parse(partner)).toEqual(partner);
  });

  test('accepts a partner with no website', () => {
    const { website, ...noWebsite } = partner;
    expect(partnerSchema(image).safeParse(noWebsite).success).toBe(true);
  });

  test('rejects a country that is a name, not a two-letter code', () => {
    expect(partnerSchema(image).safeParse({ ...partner, country: 'United Kingdom' }).success).toBe(false);
  });

  test('rejects a website that is not a web address', () => {
    expect(partnerSchema(image).safeParse({ ...partner, website: 'imperial.ac.uk' }).success).toBe(false);
  });

  test('accepts an order, and rejects one that is not a whole number above zero', () => {
    expect(partnerSchema(image).parse({ ...partner, order: 1 }).order).toBe(1);
    expect(partnerSchema(image).safeParse({ ...partner, order: 0 }).success).toBe(false);
  });
});

describe('people', () => {
  test('turns the partner into a reference to the partners collection', () => {
    expect(personSchema(image).parse(person).partner).toEqual({ collection: 'partners', id: 'imperial' });
  });

  test('accepts a photo, and a person without one', () => {
    expect(personSchema(image).parse({ ...person, photo: LOGO }).photo).toBe(LOGO);
    expect(personSchema(image).parse(person).photo).toBeUndefined();
  });

  test('accepts an order, and a person without one', () => {
    expect(personSchema(image).parse({ ...person, order: 1 }).order).toBe(1);
    expect(personSchema(image).parse(person).order).toBeUndefined();
  });

  test('rejects an order that is not a whole number above zero', () => {
    expect(personSchema(image).safeParse({ ...person, order: 0 }).success).toBe(false);
    expect(personSchema(image).safeParse({ ...person, order: 1.5 }).success).toBe(false);
  });

  test('counts a person as current unless they are marked as past', () => {
    expect(personSchema(image).parse(person).past).toBe(false);
    expect(personSchema(image).parse({ ...person, past: true }).past).toBe(true);
  });

  test('rejects past written as a word, not true or false', () => {
    expect(personSchema(image).safeParse({ ...person, past: 'yes' }).success).toBe(false);
  });

  test('rejects a person with no role', () => {
    const { role, ...noRole } = person;
    expect(personSchema(image).safeParse(noRole).success).toBe(false);
  });
});

describe('news', () => {
  test('turns the date into a Date, and defaults to no partners', () => {
    const parsed = newsSchema(image).parse(post);
    expect(parsed.date).toEqual(new Date('2025-11-01'));
    expect(parsed.partners).toEqual([]);
  });

  test('turns each partner into a reference', () => {
    expect(newsSchema(image).parse({ ...post, partners: ['pasteur-dakar'] }).partners).toEqual([
      { collection: 'partners', id: 'pasteur-dakar' },
    ]);
  });

  test('rejects a cover image with no description', () => {
    expect(newsSchema(image).safeParse({ ...post, cover: { src: LOGO } }).success).toBe(false);
  });

  test('rejects a date that is not a date', () => {
    expect(newsSchema(image).safeParse({ ...post, date: 'last Tuesday' }).success).toBe(false);
  });
});

describe('publications', () => {
  test('accepts a DOI, and defaults to no countries or viruses', () => {
    expect(publicationSchema.parse(publication)).toEqual({ ...publication, countries: [], viruses: [] });
  });

  test('rejects a DOI written as a web address', () => {
    expect(publicationSchema.safeParse({ doi: 'https://doi.org/10.3791/69259' }).success).toBe(false);
  });

  test('rejects a country that is a name, not a two-letter code', () => {
    expect(publicationSchema.safeParse({ ...publication, countries: ['Senegal'] }).success).toBe(false);
  });
});

describe('pages', () => {
  test('accepts a page with a title and a description', () => {
    expect(pageSchema.parse(page)).toEqual(page);
  });

  test('rejects a page with no description', () => {
    expect(pageSchema.safeParse({ title: page.title }).success).toBe(false);
  });
});
