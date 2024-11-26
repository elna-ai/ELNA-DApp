import CheckWizardNameCreateModal from "components/common/CheckWizardNameCreate";
import { Button } from "react-bootstrap";
import { Trans } from "react-i18next";
import agentMontageBg from "images/botsMontageBg.webp";

function WizardPlaceholder() {
  return (
    <div className="my-wizards__wrapper">
      <div
        className="my-wizards__hero"
        style={{
          backgroundImage: `url(${agentMontageBg})`,
          backgroundSize: "cover",
          borderRadius: "16px",
        }}
      >
        {/* <img
        src={agentMontageBg}
        alt="agents montage"
        className="my-wizards__hero__img"
      /> */}
        <h3 className="my-wizards__hero__title">
          <Trans i18nKey="wizards.myWizardsDesc" components={{ br: <br /> }} />
        </h3>
      </div>
      <div className="my-wizards__footer">
        <div>
          <div className="my-wizards__footer__title">Create an Ai Agent</div>
          <div className="my-wizards__footer__description">
            Craft and fine tune your agent
          </div>
        </div>
        <CheckWizardNameCreateModal>
          <Button>Create Agent</Button>
        </CheckWizardNameCreateModal>
      </div>
    </div>

  );
}

export default WizardPlaceholder;
