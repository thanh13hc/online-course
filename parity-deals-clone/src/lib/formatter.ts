const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export function formatCompactNumber(rawNumber: number) {
  return compactNumberFormatter.format(rawNumber);
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, "");
}
