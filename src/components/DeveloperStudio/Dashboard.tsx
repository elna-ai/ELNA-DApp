import PageLoader from "components/common/PageLoader";
import { useIsDeveloper } from "hooks/reactQuery/useDeveloper";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const { data: isDeveloper, isFetching: isLoading } = useIsDeveloper();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center p-2 mx-4"
        style={{
          background:
            "linear-gradient(272deg, #276E4C 49.81%, #266E4B 73.5%, #3D956A 97.18%)",
          boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.08)",
          borderRadius: "1rem",
        }}
      >
        <div>
          <h5 className="mb-0">List your tools</h5>
          <p className="mb-0" style={{ color: "#E0E0E1" }}>
            Discover amazing tools made by the community
          </p>
        </div>
        <Button
          disabled={!isDeveloper}
          onClick={() => navigate("/developer-studio/create-tool")}
        >
          List A tool
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
