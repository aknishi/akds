/** Joins id references (e.g. for aria-describedby), dropping empty values. */
export function joinIds(...ids: Array<string | false | null | undefined>): string | undefined {
  const joined = ids.filter(Boolean).join(' ').trim();
  return joined || undefined;
}
