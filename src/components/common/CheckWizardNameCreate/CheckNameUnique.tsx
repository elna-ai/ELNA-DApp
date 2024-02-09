import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useIsWizardNameValid } from "hooks/reactQuery/wizards/useMyWizards";
import { useCreateWizardStore } from "stores/useCreateWizard";

import {
  CREATE_BOT_MODAL_INITIAL_VALUES,
  CREATE_BOT_MODAL_VALIDATION_SCHEMA,
} from "./constants";
import LoadingButton from "../LoadingButton";

type CheckNameUniqueProps = {
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
};
function CheckNameUnique({ setIsCreate }: CheckNameUniqueProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setWizardName = useCreateWizardStore(state => state.setWizardName);

  const { mutate: checkIsWizardNameValid, isPending: isCheckingName } =
    useIsWizardNameValid();

  const handleSubmit = ({ name }: { name: string }) => {
    checkIsWizardNameValid(name, {
      onError: () => toast.error("Wizard name exist for user"),
      onSuccess: response => {
        if (!response) {
          toast.error("Wizard name exist for user");
          return;
        }

        setWizardName(name);
        navigate({ pathname: "/create-agent/edit", search: `?name=${name}` });
      },
    });
  };

  return (
    <>
      <Modal.Header closeButton className="d-flex align-items-center">
        <Modal.Title>
          <h5 className="mb-0">
            <strong>{t("createAgent.nameAgent")}</strong>
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={CREATE_BOT_MODAL_INITIAL_VALUES}
        onSubmit={handleSubmit}
        validationSchema={CREATE_BOT_MODAL_VALIDATION_SCHEMA}
        onReset={() => setIsCreate(false)}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{t("createAgent.form.label.name")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !errors.name}
                  placeholder={t("createAgent.form.placeholder.name")}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="flex">
              <Button
                className="btn-light btn-modal-cancel"
                variant="link"
                type="reset"
                onClick={() => setIsCreate(false)}
                disabled={isCheckingName}
              >
                {t("common.cancel")}
              </Button>
              <LoadingButton
                type="submit"
                label={t("common.ok")}
                isLoading={isCheckingName}
                isDisabled={isCheckingName}
              />
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CheckNameUnique;
