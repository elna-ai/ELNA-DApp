import { useEffect } from "react";
import { toast } from "react-toastify";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PageLoader from "components/common/PageLoader";
import { useFetchAllWizards } from "hooks/reactQuery/wizards/useWizard";

function Agents() {
  const { data: wizards, isFetching, error, isError } = useFetchAllWizards();

  useEffect(() => {
    if (!isError) return;

    toast.error(error.message);
  }, [isError]);

  if (isFetching) {
    return <PageLoader />;
  }

  return (
    <Container>
      <Row className="fw-bold gap-5">
        <Col>ID</Col>
        <Col>name</Col>
        <Col>user principal</Col>
        <Col>visibility</Col>
        <Col>isPublished</Col>
      </Row>
      {wizards?.map(wizard => (
        <Row className="gap-2">
          <Col>{wizard.id}</Col>
          <Col>{wizard.name}</Col>
          <Col>{wizard.userId}</Col>
          <Col>{Object.keys(wizard.visibility).join()}</Col>
          <Col>{wizard.isPublished ? "published" : "unpublished"}</Col>
        </Row>
      ))}
    </Container>
  );
}

export default Agents;
