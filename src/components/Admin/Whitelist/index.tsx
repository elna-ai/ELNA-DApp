import { useEffect, useState } from "react";

import { Principal } from "@dfinity/principal";
import { backend } from "declarations/backend";
import { Formik } from "formik";
import { useWallet } from "hooks/useWallet";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import PageLoader from "components/common/PageLoader";
import { WHITElIST_USER_VALIDATION_SCHEMA } from "./constants";

function WhitelistUsers() {
  const [whitelistedUsers, setWhitelistedUsers] = useState<Principal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowWhitelistModal, setIsShowWhitelistModal] = useState(false);

  const wallet = useWallet();

  const getWhitelistedUsers = async () => {
    if (wallet === undefined) return;

    try {
      setIsLoading(true);
      const data = await backend.getWhitelistedUser(wallet?.principalId);
      setWhitelistedUsers(data);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't fetch whitelisted users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWhitelistedUsers();
  }, [wallet?.principalId]);

  const handleWhitList = async (values: { principleId: string }) => {
    if (wallet === undefined) {
      toast.error("user not logged in");
      return;
    }
    try {
      const principal = Principal.fromText(values.principleId);
      try {
        const data = await backend.whitelistUserFromUi(
          Principal.fromText(wallet.principalId),
          principal
        );
        console.log(data);
        toast.success(data);
        getWhitelistedUsers();
      } catch (e) {
        toast.error("something went wrong");
        console.error(e);
      } finally {
        setIsShowWhitelistModal(false);
      }
    } catch (e) {
      toast.error("Invalid principal Id");
      console.error(e);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <div>
        <Button onClick={() => setIsShowWhitelistModal(true)}>Add user</Button>
      </div>
      <div className="admin__whitelist__wrapper">
        {whitelistedUsers.map(principal => (
          <div className="admin__whitelist__item">
            <span>{principal.toText()}</span>
            <Button variant="danger">Delete</Button>
          </div>
        ))}
      </div>
      <Modal
        show={isShowWhitelistModal}
        onHide={() => setIsShowWhitelistModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ principleId: "" }}
            validationSchema={WHITElIST_USER_VALIDATION_SCHEMA}
            onReset={() => setIsShowWhitelistModal(false)}
            onSubmit={data => console.log(data)}
          >
            {({ dirty, values, handleChange, handleReset }) => (
              <Form>
                <Form.Group>
                  <Form.Label className="fs-7">Principal id</Form.Label>
                  <Form.Control
                    name="principleId"
                    as="input"
                    style={{
                      color: "#fff",
                    }}
                    value={values.principleId || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="mt-2">
                  <Button
                    className="ml-auto px-5"
                    onClick={() => handleWhitList(values)}
                    disabled={!dirty}
                  >
                    Add user
                  </Button>
                  <Button type="reset" variant="link" onClick={handleReset}>
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default WhitelistUsers;
