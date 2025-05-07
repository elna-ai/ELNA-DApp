export const isRagErr = <T>(
  response: T
): response is Extract<T, { Err: unknown }> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response as any).Err !== undefined;
