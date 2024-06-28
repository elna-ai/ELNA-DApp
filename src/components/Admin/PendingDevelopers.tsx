import { toast } from "react-toastify";

import LoadingButton from "components/common/LoadingButton";
import PageLoader from "components/common/PageLoader";
import {
  useApproveDeveloper,
  useGetDevelopers,
  useGetPendingDeveloperRequest,
  useRejectDeveloper,
} from "hooks/reactQuery/useDeveloper";

function PendingDevelopers() {
  const { data: pendingDevelopers, isFetching: isLoading } =
    useGetPendingDeveloperRequest();
  const { mutate: approveDeveloper, isPending: isApprovingDeveloper } =
    useApproveDeveloper();
  const { mutate: rejectDeveloper, isPending: isRejectDeveloper } =
    useRejectDeveloper();

  const handleApprove = (id: string) => {
    approveDeveloper(id, {
      onSuccess: () => toast.success("User approved"),
      onError: error => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  const handleRejection = (id: string) => {
    rejectDeveloper(id, {
      onSuccess: () => toast.success("User rejected"),
      onError: error => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Alias</th>
            <th>Description</th>
            <th>Email</th>
            <th>Github</th>
            <th>Principal</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingDevelopers?.map(dev => (
            <tr key={dev.id}>
              <td>{dev.id}</td>
              <td>{dev.alias}</td>
              <td>{dev.description}</td>
              <td>{dev.email}</td>
              <td>{dev.github}</td>
              <td>{dev.principal.toString()}</td>
              <td>{Object.keys(dev.status).join(",")}</td>
              <td>
                <div className="d-flex">
                  <LoadingButton
                    label="Approve"
                    onClick={() => handleApprove(dev.id)}
                    isLoading={isApprovingDeveloper}
                    isDisabled={isRejectDeveloper}
                  />

                  <LoadingButton
                    variant="danger"
                    onClick={() => handleRejection(dev.id)}
                    label="Reject"
                    isLoading={isRejectDeveloper}
                    isDisabled={isApprovingDeveloper}
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

export default PendingDevelopers;
