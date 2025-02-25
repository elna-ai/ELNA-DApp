import { Formik } from 'formik';

import Modal from 'react-bootstrap/Modal';
import { XINTEGRATION_INITIAL_VALUE, XINTEGRATION_VALIDATION_SCHEMA } from '../../constants';
import LoadingButton from 'components/common/LoadingButton';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from "uuid";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { useAddAgentIntegration, useUpdateAgentIntegration } from 'hooks/reactQuery/useAgents';
import { useCreateWizardStore } from 'stores/useCreateWizard';
import queryClient from 'utils/queryClient';
import { QUERY_KEYS } from 'src/constants/query';
import { XAgentIntegration, XAgentIntegrationResponse } from 'src/types';
import { useEffect } from 'react';
import { useAddAgentIntegration, useShowWizard } from 'hooks/reactQuery/wizards/useWizard';
import { useWallet } from 'hooks/useWallet';

type IntegrationModalProps = {
    integrationData?: XAgentIntegrationResponse,
    // toggleIntegration: boolean,
    show: boolean,
    onHide: () => void
}

function XIntegrationModal({
    integrationData,
    // toggleIntegration,
    show,
    onHide
}: IntegrationModalProps) {

    const wallet = useWallet();
    const { uuid } = useParams();
    const wizardId = useCreateWizardStore(state => state.wizardId);
    const { data: wizard } = useShowWizard(wizardId || uuid);
    const { mutate: addAgentIntegration, isPending: isUploadingAgentIntegration } = useAddAgentIntegration();
    // const { mutate: updateAgentIntegration, isPending: isUpdatingAgentIntegration } = useUpdateAgentIntegration();

    const handleSubmit = async (values: typeof XINTEGRATION_INITIAL_VALUE) => {
        const userId = wallet?.principalId;
        if (userId === undefined) return;

        // if (integrationData?.integration_id) handleUpdateIntegration(integrationData, credentials)
        else if (!!wizard?.name && !!wizard?.biography) {
            const integration_id = uuidv4();
            addAgentIntegration(
                {
                    x_api_key: values.apiKey,
                    x_api_key_secret: values.apiKeySecret,
                    x_access_token: values.accessToken,
                    x_access_token_secret: values.accessTokenSecret,
                    x_bearer_token: values.bearerToken,
                    agent_id: wizard?.id,
                    owner: userId,
                    prompt: wizard?.biography,
                    integration_id,
                    agent_name: wizard?.name,
                },
                {
                    onSuccess: () => {
                        toast.success("X Integration successful");
                        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS, wizardId ?? uuid] });
                    },
                }
            );
        }
    };

    const handleUpdateIntegration = async (integrationData: XAgentIntegration, credentials: typeof XINTEGRATION_INITIAL_VALUE) => {
        // updateAgentIntegration(
        //     {
        //         integration_id: integrationData.integration_id,
        //         agent_name: integrationData?.agent_name,
        //         agent_id: wizardId || uuid,
        //         integration_type: "X",
        //         is_enabled: toggleIntegration,
        //         credentials: {
        //             x_api_key: credentials.apiKey,
        //             x_api_key_secret: credentials.apiKeySecret,
        //             x_access_token: credentials.accessToken,
        //             x_access_token_secret: credentials.accessTokenSecret,
        //             x_bearer_token: credentials.bearerToken,
        //             user_id: credentials.userId,
        //         },
        //     },
        //     {
        //         onSuccess: () => {
        //             toast.success("X Integration successfully updated");
        //             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS, wizardId ?? uuid] });
        //         },
        //     }
        // )
    }

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
            <Modal.Header className='d-flex justify-content-between' closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Connect X (Twitter)
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={
                        integrationData === undefined ?
                            XINTEGRATION_INITIAL_VALUE
                            :
                            // (() => {
                            //     return 
                            {
                                apiKey: integrationData.credentials.x_api_key,
                                apiKeySecret: integrationData.credentials.x_api_key_secret,
                                accessToken: integrationData.credentials.x_access_token,
                                accessTokenSecret: integrationData.credentials.x_access_token_secret,
                                bearerToken: integrationData.credentials.x_bearer_token,
                                owner: "",
                            }
                        // })()
                    }
                    validationSchema={XINTEGRATION_VALIDATION_SCHEMA}
                    onSubmit={handleSubmit}
                >
                    {({ dirty, errors, handleSubmit, handleReset, values, handleChange }) => (
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
                                        name="owner"
                                        maxLength={1000}
                                        value={values.owner}
                                        onChange={handleChange}
                                        isInvalid={!!errors.owner}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.owner}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-flex justify-content-end h-auto m-2">
                                    <LoadingButton
                                        label={integrationData ? "Update" : "Submit"}
                                        className="ml-auto px-5 mt-3"
                                        isDisabled={!dirty}
                                        isLoading={false
                                            // isUploadingAgentIntegration || isUpdatingAgentIntegration
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
