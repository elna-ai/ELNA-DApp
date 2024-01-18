import { useEffect, useState } from "react";

import { Principal } from "@dfinity/principal";
import { Formik } from "formik";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import LoadingButton from "components/common/LoadingButton";
import {
  useAddWhitelistedUser,
  useGetWhitelistedUsers,
} from "hooks/reactQuery/useUser";
import PageLoader from "components/common/PageLoader";

import { WHITElIST_USER_VALIDATION_SCHEMA } from "./constants";
import RemoveWhitelistModal from "./RemoveWhitelistModal";
import { useTranslation } from "react-i18next";

function WhitelistUsers() {
  const [isShowWhitelistModal, setIsShowWhitelistModal] = useState(false);
  const [isShowRemoveWhitelistModal, setIsShowRemoveWhitelistModal] =
    useState(false);
  const [whitelistedUserToDelete, setWhitelistedUserToDelete] =
    useState<Principal>();

  const { t } = useTranslation();
  const {
    data: whitelistedUsers,
    error,
    isError,
    isFetching: isLoading,
  } = useGetWhitelistedUsers();
  const { mutate: whitelistUser, isPending: isWhitelistingUser } =
    useAddWhitelistedUser();

  useEffect(() => {
    if (!isError) return;
    toast.error(error.message);
  }, [isError]);

  const handleWhitList = async (values: { principleId: string }) => {
    try {
      const principalId = Principal.fromText(values.principleId.trim());
      whitelistUser(principalId, {
        onSuccess: () => setIsShowWhitelistModal(false),
      });
    } catch (e) {
      toast.error("Invalid principal Id");
    }
  };

  const handleRemoveWhitelist = (principalId: Principal) => {
    setWhitelistedUserToDelete(principalId);
    setIsShowRemoveWhitelistModal(true);
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <div>
        <Button onClick={() => setIsShowWhitelistModal(true)}>
          {t("common.add", { entity: "user" })}
        </Button>
      </div>
      <div className="admin__whitelist__wrapper">
        {(whitelistedUsers ?? []).map(principal => (
          <div className="admin__whitelist__item" key={principal.toText()}>
            <span>{principal.toText()}</span>
            <Button
              variant="danger"
              onClick={() => handleRemoveWhitelist(principal)}
            >
              {t("common.delete", { entity: "" })}
            </Button>
          </div>
        ))}
      </div>
      <Modal
        show={isShowWhitelistModal}
        onHide={() => setIsShowWhitelistModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("common.add", { entity: "user" })}</Modal.Title>
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
                  <Form.Label className="fs-7">
                    {t("whitelistUser.form.principalId")}
                  </Form.Label>
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
                <div className="mt-2 d-flex gap-2">
                  <LoadingButton
                    label={t("common.add", { entity: "user" })}
                    isDisabled={!dirty}
                    isLoading={isWhitelistingUser}
                    onClick={() => handleWhitList(values)}
                  />
                  <Button type="reset" variant="link" onClick={handleReset}>
                    {t("common.cancel")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <RemoveWhitelistModal
        isOpen={isShowRemoveWhitelistModal}
        onClose={() => {
          setWhitelistedUserToDelete(undefined);
          setIsShowRemoveWhitelistModal(false);
        }}
        principalId={whitelistedUserToDelete}
      />
    </>
  );
}

export default WhitelistUsers;
