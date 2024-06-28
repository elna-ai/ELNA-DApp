import { toast } from "react-toastify";

import LoadingButton from "components/common/LoadingButton";
import PageLoader from "components/common/PageLoader";
import {
  useDisableDeveloper,
  useEnableDeveloper,
  useGetDevelopers,
} from "hooks/reactQuery/useDeveloper";

function Developers() {
  const { data: developers, isFetching: isLoading } = useGetDevelopers();
  const { mutate: disableDeveloper, isPending: isDisablingDeveloper } =
    useDisableDeveloper();
  const { mutate: enableDeveloper, isPending: isEnablingDeveloper } =
    useEnableDeveloper();

  const handleDisableDeveloper = (developerId: string) => {
    disableDeveloper(developerId, {
      onSuccess: message => toast.success(message),
      onError: error => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  const handleEnableDeveloper = (developerId: string) => {
    enableDeveloper(developerId, {
      onSuccess: message => toast.success(message),
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
            <th>Email</th>
            <th>Github</th>
            <th>Principal</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {developers?.map(dev => (
            <tr key={dev.id}>
              <td>{dev.id}</td>
              <td>{dev.alias}</td>
              <td>{dev.email}</td>
              <td>{dev.github}</td>
              <td>{dev.principal.toString()}</td>
              <td>{Object.keys(dev.status).join(",")}</td>
              <th>
                {Object.keys(dev.status).join(",") === "approved" ? (
                  <LoadingButton
                    label="Revoke access"
                    isLoading={isDisablingDeveloper}
                    isDisabled={isDisablingDeveloper}
                    onClick={() => handleDisableDeveloper(dev.id)}
                  />
                ) : (
                  <LoadingButton
                    label="Enable developer"
                    isLoading={isEnablingDeveloper}
                    isDisabled={isEnablingDeveloper}
                    onClick={() => handleEnableDeveloper(dev.id)}
                  />
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Developers;
