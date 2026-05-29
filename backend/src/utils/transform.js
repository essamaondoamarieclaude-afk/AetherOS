const snakeToCamel = (s) => s.replace(/_([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());

export const toCamelCase = (row) => {
  if (!row || typeof row !== 'object') return row;
  if (Array.isArray(row)) return row.map(toCamelCase);
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [snakeToCamel(k), v])
  );
};
