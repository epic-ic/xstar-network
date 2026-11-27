import type { Loader, LoaderContext } from 'astro/loaders';
import { describe, expect, test } from 'vitest';
import { byLanguage, findDuplicates, unique } from './unique.ts';

const imperial = { id: 'imperial', data: { name: 'Imperial College London', order: 1 } };
const cambridge = { id: 'cambridge', data: { name: 'University of Cambridge' } };
const lshtm = { id: 'lshtm', data: { name: 'London School of Hygiene & Tropical Medicine' } };

const loaderOf = (entries: { id: string; data: Record<string, unknown> }[]) => {
  let loaded = false;
  const loader: Loader = {
    name: 'stand-in',
    load: async () => {
      await new Promise((resolve) => setTimeout(resolve));
      loaded = true;
    },
  };
  const context = { collection: 'partners', store: { values: () => (loaded ? entries : []) } } as unknown as LoaderContext;
  return { loader, context, wasLoaded: () => loaded };
};

describe('findDuplicates', () => {
  test('finds nothing when every value is different', () => {
    expect(findDuplicates([imperial, cambridge, lshtm], 'name')).toEqual([]);
  });

  test('names the entry that repeats a value, and the one it repeats', () => {
    const copy = { id: 'imperial-copy', data: { name: 'Imperial College London' } };
    expect(findDuplicates([imperial, copy], 'name')).toEqual([
      '"imperial-copy" has the same name as "imperial" (Imperial College London)',
    ]);
  });

  test('ignores entries without the field, so two partners with no order are fine', () => {
    expect(findDuplicates([imperial, cambridge, lshtm], 'order')).toEqual([]);
  });

  test('allows the same value in different languages, but not twice in one', () => {
    const en = { id: 'en/kavindi', data: { name: 'Anthony Charles Kavindi' } };
    const fr = { id: 'fr/kavindi', data: { name: 'Anthony Charles Kavindi' } };
    const enAgain = { id: 'en/kavindi-2', data: { name: 'Anthony Charles Kavindi' } };
    expect(findDuplicates([en, fr], 'name', byLanguage)).toEqual([]);
    expect(findDuplicates([en, fr, enAgain], 'name', byLanguage)).toHaveLength(1);
  });
});

describe('unique', () => {
  test('runs the loader it wraps, and passes when nothing repeats', async () => {
    const { loader, context, wasLoaded } = loaderOf([imperial, cambridge]);
    await unique(loader, ['name', 'order']).load(context);
    expect(wasLoaded()).toBe(true);
  });

  test('fails with every repeat in the collection', async () => {
    const twice = { id: 'cambridge', data: { name: 'Imperial College London', order: 1 } };
    const { loader, context } = loaderOf([imperial, twice]);
    await expect(unique(loader, ['name', 'order']).load(context)).rejects.toThrow(
      'Duplicates in partners: "cambridge" has the same name as "imperial" (Imperial College London); "cambridge" has the same order as "imperial" (1)',
    );
  });
});
