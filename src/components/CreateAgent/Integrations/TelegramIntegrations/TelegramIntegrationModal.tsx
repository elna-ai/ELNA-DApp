import { Formik } from 'formik';

import Modal from 'react-bootstrap/Modal';
import { TELEGRAM_INTEGRATION_INITIAL_VALUE, TELEGRAM_INTEGRATION_VALIDATION_SCHEMA } from '../../constants';
import LoadingButton from 'components/common/LoadingButton';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { useAddAgentIntegration, useGetAgent, useUpdateAgentIntegration } from 'hooks/reactQuery/useAgents';
import { v4 as uuidv4 } from "uuid";
import queryClient from 'utils/queryClient';
import { QUERY_KEYS } from 'src/constants/query';
// import { AgentIntegrationData, TelegramAgentCredentials } from 'src/types';
import { useEffect } from 'react';
import { useWallet } from 'hooks/useWallet';
import { useCreateWizardStore } from 'stores/useCreateWizard';
import { useShowWizard } from 'hooks/reactQuery/wizards/useWizard';

type IntegrationModalProps = {
    // integrationData?: AgentIntegrationData,
    toggleIntegration: boolean,
    show: boolean,
    onHide: () => void
}

function TelegramIntegrationModal({
    // integrationData,
    toggleIntegration,
    show,
    onHide
}: IntegrationModalProps) {

    const wallet = useWallet();
    const { uuid } = useParams();
    const wizardId = useCreateWizardStore(state => state.wizardId);
    const { data: wizard } = useShowWizard(wizardId || uuid);
    // const { mutate: addAgentIntegration, isPending: isUploadingAgentIntegration } = useAddAgentIntegration();
    // const { mutate: updateAgentIntegration, isPending: isUpdatingAgentIntegration } = useUpdateAgentIntegration();

    const handleSubmit = async (values: typeof TELEGRAM_INTEGRATION_INITIAL_VALUE) => {
        const userId = wallet?.principalId;
        if (userId === undefined) return;
        const { ...credentials } = values;

        // if (integrationData?.integration_id) handleUpdateIntegration(integrationData, credentials)
        // else if (!!wizard?.name && !!wizard?.biography) {
        const integration_id = uuidv4();
        // addAgentIntegration(
        //     {
        //         agent_id: wizard?.id,
        //         integration_id,
        //         agent_owner: userId,
        //         agent_name: wizard?.name,
        //         agent_prompt: wizard?.biography,
        //         integration_type: "TELEGRAM",
        //         is_enabled: true,
        //         credentials: {
        //             telegram_api_key: credentials.telegramApiKey,
        //         },
        //     },
        //     {
        //         onSuccess: () => {
        //             toast.success("Telegram Integration successful");
        //             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS, wizardId || uuid,] });
        //         },
        //     }
        // );
        // }
    };

    // const handleUpdateIntegration = async (integrationData: AgentIntegrationData, credentials: typeof TELEGRAM_INTEGRATION_INITIAL_VALUE) => {
    // updateAgentIntegration(
    //     {
    //         integration_id: integrationData.integration_id,
    //         agent_name: integrationData?.agent_name,
    //         agent_id: wizardId || uuid,
    //         integration_type: "TELEGRAM",
    //         is_enabled: toggleIntegration,
    //         credentials: {
    //             telegram_api_key: credentials.telegramApiKey,
    //         },
    //     },
    //     {
    //         onSuccess: () => {
    //             toast.success("Telegram Integration successfully updated");
    //             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENT_INTEGRATIONS, wizardId || uuid,] });
    //         },
    //     }
    // )
    // }

    // useEffect(() => {
    //     if (toggleIntegration !== integrationData?.is_enabled) {
    //         if (integrationData?.integration_id) {
    //             const obj = {
    //                 telegramApiKey: (integrationData.credentials as TelegramAgentCredentials).telegram_api_key,
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
                    Connect Telegram
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={
                        // integrationData === undefined ?
                        TELEGRAM_INTEGRATION_INITIAL_VALUE
                        // : (() => {
                        //     const creds = integrationData.credentials as TelegramAgentCredentials;
                        //     return {
                        //         telegramApiKey: creds.telegram_api_key,
                        //     };
                        // })()
                    }
                    validationSchema={TELEGRAM_INTEGRATION_VALIDATION_SCHEMA}
                    onSubmit={handleSubmit}
                >
                    {({ dirty, errors, handleSubmit, handleReset, values, handleChange }) => (
                        <Form onSubmit={handleSubmit} onReset={handleReset} noValidate>
                            <div className="personaCreate">
                                <h3 className="sub-title-bot">Telegram API key from Botfather</h3>
                                <Form.Group>
                                    <Form.Control
                                        className="form-control"
                                        as="input"
                                        placeholder="Enter Telegram API key from Botfather"
                                        name="telegramApiKey"
                                        maxLength={1000}
                                        value={values.telegramApiKey}
                                        onChange={handleChange}
                                        isInvalid={!!errors.telegramApiKey}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.telegramApiKey}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-flex justify-content-end h-auto m-2">
                                    <LoadingButton
                                        label={
                                            // integrationData ? "Update" : 
                                            "Submit"}
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

export default TelegramIntegrationModal;
