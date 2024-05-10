import PageLoader from "components/common/PageLoader";
import { useGetDevelopers } from "hooks/reactQuery/useDeveloper";

function Developers() {
  const { data: developers, isFetching: isLoading } = useGetDevelopers();

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Developers;
