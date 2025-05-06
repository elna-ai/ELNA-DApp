export const trim = (principalId?: string, firstLength = 5, lastLength = 3) => {
  if (principalId) {
    const firstPart = principalId.slice(0, firstLength);
    const secondPart = principalId.slice(
      principalId.length - lastLength,
      principalId.length
    );
    return `${firstPart}...${secondPart}`;
  } else return "";
};
