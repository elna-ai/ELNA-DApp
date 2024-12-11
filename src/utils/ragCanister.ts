export const isRagErr = <T>(
  response: T
): response is Extract<T, { Err: unknown }> =>
  (response as any).Err !== undefined;
