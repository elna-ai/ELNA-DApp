import { Formik } from "formik";

import Modal from "react-bootstrap/Modal";
import {
  X_INTEGRATION_INITIAL_VALUE,
  X_INTEGRATION_VALIDATION_SCHEMA,
} from "../constants";
import LoadingButton from "components/common/LoadingButton";
import { Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import {
//   useAddAgentIntegration,
//   useGetAgent,
//   useGetAgentIntegrations,
//   useUpdateAgentIntegration,
// } from "hooks/reactQuery/useAgents";
import { v4 as uuid } from "uuid";
// import { useCreateBeastStore } from "stores/useCreateBeast";
import queryClient from "utils/queryClient";
import { QUERY_KEYS } from "src/constants/query";

type IntegrationModalProps = {
  show: boolean;
  onHide: () => void;
};

function XIntegrationModal({ show, onHide }: IntegrationModalProps) {
  const { publicKey } = { publicKey: undefined };
  // useWallet();
  const { beastId } = useParams();
  // const { id } = useCreateBeastStore();
  // const { data: beast, isFetching: isLoadingBeast } = useGetAgent(
  //   beastId || id
  // );
  // const { data: integrationData, isFetching: isLoadingIntegrationData } =
  //   useGetAgentIntegrations(beast?.integration_id);
  // const {
  //   mutate: addAgentIntegration,
  //   isPending: isUploadingAgentIntegration,
  // } = useAddAgentIntegration();
  // const {
  //   mutate: updateAgentIntegration,
  //   isPending: isUpdatingAgentIntegration,
  // } = useUpdateAgentIntegration();

  const handleSubmit = async (values: typeof X_INTEGRATION_INITIAL_VALUE) => {
    // const userId = publicKey?.toBase58();
    const userId = publicKey;
    if (userId === undefined) return;
    const { ...credentials } = values;

    // if (!!beast?.integration_id) {
    //   updateAgentIntegration(
    //     {
    //       integration_id: beast.integration_id,
    //       agent_name: beast?.name,
    //       integration_type: "X",
    //       credentials: {
    //         x_api_key: credentials.apiKey,
    //         x_api_key_secret: credentials.apiKeySecret,
    //         x_access_token: credentials.accessToken,
    //         x_access_token_secret: credentials.accessTokenSecret,
    //         x_bearer_token: credentials.bearerToken,
    //         user_id: credentials.userId,
    //       },
    //     },
    //     {
    //       onSuccess: () => {
    //         toast.success("X Integration successfully updated");
    //         queryClient.invalidateQueries({
    //           queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS, beastId ?? id],
    //         });
    //       },
    //     }
    //   );
    // } else if (!!beast?.name && !!beast?.bio) {
    //   const integration_id = uuid();
    //   addAgentIntegration(
    //     {
    //       agent_id: beast?.id,
    //       integration_id,
    //       agent_owner: userId,
    //       agent_name: beast?.name,
    //       agent_prompt: beast?.bio,
    //       integration_type: "X",
    //       credentials: {
    //         x_api_key: credentials.apiKey,
    //         x_api_key_secret: credentials.apiKeySecret,
    //         x_access_token: credentials.accessToken,
    //         x_access_token_secret: credentials.accessTokenSecret,
    //         x_bearer_token: credentials.bearerToken,
    //         user_id: credentials.userId,
    //       },
    //     },
    //     {
    //       onSuccess: () => {
    //         toast.success("X Integration successful");
    //         queryClient.invalidateQueries({
    //           queryKey: [QUERY_KEYS.AGENTS, beastId ?? id],
    //         });
    //       },
    //     }
    //   );
    // }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="d-flex justify-content-between" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Connect X (Twitter)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={X_INTEGRATION_INITIAL_VALUE}
          validationSchema={X_INTEGRATION_VALIDATION_SCHEMA}
          onSubmit={handleSubmit}
        >
          {({
            dirty,
            errors,
            handleSubmit,
            handleReset,
            values,
            handleChange,
          }) => (
            <Form onSubmit={handleSubmit} onReset={handleReset} noValidate>
              <div className="personaCreate">
                <h3 className="sub-title-bot">X API Key</h3>
                <Form.Group>
                  <Form.Control
                    className="form-control"
                    as="input"
                    placeholder="Enter API key"
                    name="apiKey"
                    maxLength={1000}
                    value={values.apiKey}
                    onChange={handleChange}
                    isInvalid={!!errors.apiKey}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apiKey}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">X API Key Secret</h3>
                <Form.Group>
                  <Form.Control
                    className="form-control"
                    as="input"
                    placeholder="Enter API key secret"
                    name="apiKeySecret"
                    maxLength={1000}
                    value={values.apiKeySecret}
                    onChange={handleChange}
                    isInvalid={!!errors.apiKeySecret}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apiKeySecret}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">Access Token</h3>
                <Form.Group>
                  <Form.Control
                    className="form-control"
                    as="input"
                    placeholder="Enter access token"
                    name="accessToken"
                    maxLength={1000}
                    value={values.accessToken}
                    onChange={handleChange}
                    isInvalid={!!errors.accessToken}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accessToken}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">Access Token Secret</h3>
                <Form.Group>
                  <Form.Control
                    className="form-control"
                    as="input"
                    placeholder="Enter access token secret"
                    name="accessTokenSecret"
                    maxLength={1000}
                    value={values.accessTokenSecret}
                    onChange={handleChange}
                    isInvalid={!!errors.accessTokenSecret}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accessTokenSecret}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">Bearer Token</h3>
                <Form.Group>
                  <Form.Control
                    className="form-control"
                    as="input"
                    placeholder="Enter bearer token"
                    name="bearerToken"
                    maxLength={1000}
                    value={values.bearerToken}
                    onChange={handleChange}
                    isInvalid={!!errors.bearerToken}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bearerToken}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">Twitter Handle (Username)</h3>
                <Form.Group>
                  <Form.Control
                    className="form-control"
                    as="input"
                    placeholder="Twitter username"
                    name="userId"
                    maxLength={1000}
                    value={values.userId}
                    onChange={handleChange}
                    isInvalid={!!errors.userId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.userId}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-end h-auto m-2">
                  <LoadingButton
                    // label={integrationData ? "Update" : "Submit"}
                    label={"Submit"}
                    className="ml-auto px-5 mt-3"
                    isDisabled={!dirty}
                    isLoading={false}
                    // isLoading={
                    //   isUploadingAgentIntegration || isUpdatingAgentIntegration
                    // }
                    type="submit"
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default XIntegrationModal;
