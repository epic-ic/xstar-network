import { describe, expect, test } from 'vitest';
import { checkReferences, findBrokenReferences } from './references.ts';

const BROKEN_LINE =
  '[ERROR] [content] Invalid content reference: entry "en/anthony-charles-kavindi" in collection "people" (field: partner) references "kcmcu" in collection "partners", but that entry does not exist.';
const SYNCED = '[content] Synced content';
const SCHEMA_ERROR = '[InvalidContentEntryDataError] news → first data does not match collection schema.';
const SYNC_FAILED = 1;

const silent = () => {};

describe('findBrokenReferences', () => {
  test('finds no broken references in a clean log', () => {
    expect(findBrokenReferences(SYNCED)).toEqual([]);
  });

  test('picks out only the broken reference lines', () => {
    expect(findBrokenReferences(`${SYNCED}\n${BROKEN_LINE}\n${SYNCED}`)).toEqual([BROKEN_LINE]);
  });
});

describe('checkReferences', () => {
  test('passes when sync succeeds with no broken references', () => {
    expect(checkReferences(() => ({ output: SYNCED, status: 0 }), silent)).toBe(0);
  });

  test('fails when sync succeeds but logged a broken reference', () => {
    const printed: string[] = [];
    const code = checkReferences(() => ({ output: BROKEN_LINE, status: 0 }), (text) => printed.push(text));
    expect(code).toBe(1);
    expect(printed).toEqual([BROKEN_LINE, 'Found 1 broken content reference(s). Fix them before building.']);
  });

  test('passes on the exit code when sync itself fails', () => {
    expect(checkReferences(() => ({ output: SCHEMA_ERROR, status: SYNC_FAILED }), silent)).toBe(SYNC_FAILED);
  });

  test('fails when sync was stopped before it could exit', () => {
    expect(checkReferences(() => ({ output: '', status: null }), silent)).toBe(1);
  });
});
