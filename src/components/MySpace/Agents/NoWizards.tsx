import CheckWizardNameCreateModal from "components/common/CheckWizardNameCreate";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NoChatWizardImg from "images/no-chatbot.png";

function NoWizards() {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-100 py-5 text-center">
        <img className="d-inline" src={NoChatWizardImg} alt="no wizard" />
        <h5>{t("mySpace.myAgents.noWizardsHeader")}</h5>
        <p>{t("mySpace.myAgents.noWizardsDesc")}</p>
        <CheckWizardNameCreateModal>
          <Button>{t("mySpace.myAgents.createAgentBtn")}</Button>
        </CheckWizardNameCreateModal>
      </div>
    </>
  );
}

export default NoWizards;
