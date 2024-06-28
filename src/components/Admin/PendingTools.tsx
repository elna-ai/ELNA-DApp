import { toast } from "react-toastify";

import LoadingButton from "components/common/LoadingButton";
import PageLoader from "components/common/PageLoader";
import { useRejectDeveloper } from "hooks/reactQuery/useDeveloper";
import {
  useApproveTool,
  useGetDeveloperTools,
} from "hooks/reactQuery/useDeveloperTools";

function PendingTools() {
  const { data: tools, isFetching } = useGetDeveloperTools();
  const { mutate: approveTool, isPending: isToolApproving } = useApproveTool();
  const { mutate: rejectTool, isPending: isToolRejecting } =
    useRejectDeveloper();

  const handleApprove = (id: string) => {
    approveTool(id, {
      onSuccess: () => toast.success("Tool Approved"),
      onError: e => {
        console.error(e);
        toast.error(e.message);
      },
    });
  };

  const handleRejection = (id: string) => {
    rejectTool(id, {
      onSuccess: () => toast.success("Tool Rejected"),
      onError: e => {
        console.error(e);
        toast.error(e.message);
      },
    });
  };

  if (isFetching) {
    return <PageLoader />;
  }

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Project url</th>
            <th>Category</th>
            <th>Principal</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools?.map(tool => (
            <tr key={tool.id}>
              <td>{tool.id}</td>
              <td>{tool.name}</td>
              <td>{tool.description}</td>
              <td>{tool.projectUrl}</td>
              <td>{tool.category}</td>
              <td>{tool.principal.toString()}</td>
              <td>{Object.keys(tool.status).join(",")}</td>
              <td>
                <div className="d-flex">
                  <LoadingButton
                    label="Approve"
                    onClick={() => handleApprove(tool.id)}
                    isLoading={isToolApproving}
                    isDisabled={isToolRejecting}
                  />

                  <LoadingButton
                    variant="danger"
                    onClick={() => handleRejection(tool.id)}
                    label="Reject"
                    isLoading={isToolRejecting}
                    isDisabled={isToolApproving}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendingTools;
