import { Formik } from "formik";

import Modal from "react-bootstrap/Modal";
import {
  XINTEGRATION_INITIAL_VALUE,
  XINTEGRATION_VALIDATION_SCHEMA,
} from "../../constants";
import LoadingButton from "components/common/LoadingButton";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateWizardStore } from "stores/useCreateWizard";
import queryClient from "utils/queryClient";
import { QUERY_KEYS } from "src/constants/query";
import { XAgentIntegrationResponse } from "src/types";
import { useShowWizard } from "hooks/reactQuery/wizards/useWizard";
import { useWallet } from "hooks/useWallet";
import {
  useAddAgentXIntegration,
  useUpdateAgentXIntegration,
} from "hooks/reactQuery/wizards/useIntegrations";

type IntegrationModalProps = {
  integrationData?: XAgentIntegrationResponse;
  // toggleIntegration: boolean,
  show: boolean;
  onHide: () => void;
};

function XIntegrationModal({
  integrationData,
  // toggleIntegration,
  show,
  onHide,
}: IntegrationModalProps) {
  const wallet = useWallet();
  const { uuid } = useParams();
  const wizardId = useCreateWizardStore(state => state.wizardId);
  const { data: wizard } = useShowWizard(wizardId || uuid);
  const {
    mutate: addAgentIntegration,
    isPending: isUploadingAgentIntegration,
  } = useAddAgentXIntegration();
  const {
    mutate: updateAgentIntegration,
    isPending: isUpdatingAgentIntegration,
  } = useUpdateAgentXIntegration();

  const handleSubmit = async (values: typeof XINTEGRATION_INITIAL_VALUE) => {
    const principalId = wallet?.principalId;
    if (principalId === undefined) return;

    if (integrationData !== undefined) handleUpdateIntegration(values);
    else if (!!wizard?.name && !!wizard?.biography) {
      const integration_id = uuidv4();
      addAgentIntegration(
        {
          x_api_key: values.apiKey.trim(),
          x_api_key_secret: values.apiKeySecret.trim(),
          x_access_token: values.accessToken.trim(),
          x_access_token_secret: values.accessTokenSecret.trim(),
          x_bearer_token: values.bearerToken.trim(),
          agent_id: wizard?.id,
          owner: principalId,
          user_id: values.userId.trim(),
          prompt: wizard?.biography,
          integration_id,
          agent_name: wizard?.name,
        },
        {
          onSuccess: () => {
            toast.success("X Integration successful");
            queryClient.invalidateQueries({
              queryKey: [
                QUERY_KEYS.AGENT_INTEGRATIONS_TELEGRAM,
                uuid ?? wizardId,
              ],
            });
          },
        }
      );
    }
  };

  const handleUpdateIntegration = async (
    credentials: typeof XINTEGRATION_INITIAL_VALUE
  ) => {
    const regex = /PK#INTEGRATION_ID#(.*)/;
    const match = integrationData?.PK.match(regex);
    const integrationId = match ? match[1] : "";
    updateAgentIntegration(
      {
        x_api_key: credentials.apiKey.trim(),
        x_api_key_secret: credentials.apiKeySecret.trim(),
        x_access_token: credentials.accessToken.trim(),
        x_access_token_secret: credentials.accessTokenSecret.trim(),
        x_bearer_token: credentials.bearerToken.trim(),
        user_id: credentials.userId.trim(),
        integration_id: integrationId,
      },
      {
        onSuccess: () => {
          toast.success("X Integration successfully updated");
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS, uuid ?? wizardId],
          });
        },
      }
    );
  };

  // useEffect(() => {
  //     if (toggleIntegration !== integrationData?.is_enabled) {
  //         if (integrationData?.integration_id) {
  //             const obj = {
  //                 apiKey: (integrationData.credentials as XAgentCredentials).x_api_key,
  //                 apiKeySecret: (integrationData.credentials as XAgentCredentials).x_api_key_secret,
  //                 accessToken: (integrationData.credentials as XAgentCredentials).x_access_token,
  //                 accessTokenSecret: (integrationData.credentials as XAgentCredentials).x_access_token_secret,
  //                 bearerToken: (integrationData.credentials as XAgentCredentials).x_bearer_token,
  //                 userId: (integrationData.credentials as XAgentCredentials).user_id,
  //             }
  //             handleUpdateIntegration(integrationData, obj)
  //         }
  //     }
  // }, [toggleIntegration])

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
          initialValues={
            integrationData === undefined
              ? XINTEGRATION_INITIAL_VALUE
              : {
                  apiKey: integrationData.credentials.x_api_key,
                  apiKeySecret: integrationData.credentials.x_api_key_secret,
                  accessToken: integrationData.credentials.x_access_token,
                  accessTokenSecret:
                    integrationData.credentials.x_access_token_secret,
                  bearerToken: integrationData.credentials.x_bearer_token,
                  userId: integrationData.credentials.user_id,
                }
          }
          validationSchema={XINTEGRATION_VALIDATION_SCHEMA}
          validateOnChange={false}
          validateOnBlur={true}
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
                    as="input"
                    placeholder="Enter API key"
                    name="apiKey"
                    maxLength={1000}
                    value={values.apiKey}
                    onChange={handleChange}
                    isInvalid={!!errors.apiKey}
                    style={{ color: "white" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apiKey}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">X API Key Secret</h3>
                <Form.Group>
                  <Form.Control
                    as="input"
                    placeholder="Enter API key secret"
                    name="apiKeySecret"
                    maxLength={1000}
                    value={values.apiKeySecret}
                    onChange={handleChange}
                    isInvalid={!!errors.apiKeySecret}
                    style={{ color: "white" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apiKeySecret}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">Access Token</h3>
                <Form.Group>
                  <Form.Control
                    as="input"
                    placeholder="Enter access token"
                    name="accessToken"
                    maxLength={1000}
                    value={values.accessToken}
                    onChange={handleChange}
                    isInvalid={!!errors.accessToken}
                    style={{ color: "white" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accessToken}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">Access Token Secret</h3>
                <Form.Group>
                  <Form.Control
                    as="input"
                    placeholder="Enter access token secret"
                    name="accessTokenSecret"
                    maxLength={1000}
                    value={values.accessTokenSecret}
                    onChange={handleChange}
                    isInvalid={!!errors.accessTokenSecret}
                    style={{ color: "white" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accessTokenSecret}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">Bearer Token</h3>
                <Form.Group>
                  <Form.Control
                    as="input"
                    placeholder="Enter bearer token"
                    name="bearerToken"
                    maxLength={1000}
                    value={values.bearerToken}
                    onChange={handleChange}
                    isInvalid={!!errors.bearerToken}
                    style={{ color: "white" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bearerToken}
                  </Form.Control.Feedback>
                </Form.Group>
                <h3 className="sub-title-bot">Twitter Handle (Username)</h3>
                <Form.Group>
                  <Form.Control
                    as="input"
                    placeholder="Twitter username"
                    name="userId"
                    maxLength={1000}
                    value={values.userId}
                    onChange={handleChange}
                    isInvalid={!!errors.userId}
                    style={{ color: "white" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.userId}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-end h-auto m-2">
                  <LoadingButton
                    label={integrationData ? "Update" : "Submit"}
                    className="ml-auto px-5 mt-3"
                    isDisabled={!dirty}
                    isLoading={
                      isUploadingAgentIntegration || isUpdatingAgentIntegration
                    }
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
