export const useGetDeveloperTools = () => {
  const wallet = useWallet();

  return useQuery({
    queryKey: [QUERY_KEYS.DEVELOPER_TOOLS],
    queryFn: async () => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.getTools();
      return result;
    },
  });
};

export const useApproveTool = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (id: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.approvePendingDeveloperTool(id);
      return result;
    },
  });
};

export const useRejectTool = () => {
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (id: string) => {
      if (wallet === undefined) throw Error("user not logged in");

      const backend: Backend = await wallet.getCanisterActor(
        backendId,
        backendFactory,
        false
      );
      const result = await backend.rejectDeveloperTool(id);
      return result;
    },
  });
};


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
