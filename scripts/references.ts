const BROKEN_REFERENCE = 'Invalid content reference';
const SUCCESS = 0;
const FAILURE = 1;

export type SyncResult = { output: string; status: number | null };

export const findBrokenReferences = (log: string): string[] =>
  log.split('\n').filter((line) => line.includes(BROKEN_REFERENCE));

export const checkReferences = (sync: () => SyncResult, print: (text: string) => void): number => {
  const { output, status } = sync();
  print(output);
  if (status !== SUCCESS) {
    return status ?? FAILURE;
  }
  const broken = findBrokenReferences(output);
  if (broken.length === 0) {
    return SUCCESS;
  }
  print(`Found ${broken.length} broken content reference(s). Fix them before building.`);
  return FAILURE;
};
