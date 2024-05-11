
export const useRequestDeveloperTool = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (toolDetails: DeveloperTool) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.requestToolSubmission(toolDetails);
      return result;
    },
  });
};
