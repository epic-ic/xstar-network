import type { Loader } from 'astro/loaders';

type Entry = { id: string; data: Record<string, unknown> };
type Group = (id: string) => string;

const ALL = () => '';

export const byLanguage: Group = (id) => id.split('/')[0];

export const findDuplicates = (entries: Entry[], field: string, group: Group = ALL): string[] => {
  const first = new Map<string, string>();
  const duplicates: string[] = [];
  for (const { id, data } of entries) {
    const value = data[field];
    if (value === undefined) {
      continue;
    }
    const key = JSON.stringify([group(id), value]);
    const earlier = first.get(key);
    if (earlier === undefined) {
      first.set(key, id);
    } else {
      duplicates.push(`"${id}" has the same ${field} as "${earlier}" (${String(value)})`);
    }
  }
  return duplicates;
};

export const unique = (loader: Loader, fields: string[], group: Group = ALL): Loader => ({
  ...loader,
  load: async (context) => {
    await loader.load(context);
    const entries = context.store.values();
    const duplicates = fields.flatMap((field) => findDuplicates(entries, field, group));
    if (duplicates.length > 0) {
      throw new Error(`Duplicates in ${context.collection}: ${duplicates.join('; ')}`);
    }
  },
});
