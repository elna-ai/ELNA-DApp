import { Trans } from "react-i18next";

import agentMontageBg from "images/botsMontageBg.webp";

function WizardNotLoggedIn() {
  return (
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
  );
}

export default WizardNotLoggedIn;
