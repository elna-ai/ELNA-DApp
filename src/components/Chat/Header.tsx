import { useState } from "react";
import { useTranslation } from "react-i18next";
import { WizardDetails } from "declarations/wizard_details/wizard_details.did";
import { generateTwitterShareLink, getAvatar } from "src/utils";

import { TWITTER_SHARE_CONTENT } from "./constants";
import AgentDetails from "./AgentDetails";

type HeaderProps = {
  wizard: WizardDetails;
};

function Header({ wizard }: HeaderProps) {
  const { t } = useTranslation();
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = () => {
    setIsViewOpen(true);
  };

  return (
    <>
      <header className="text-left">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="chat-header__avatar">
              <div className="avatar">
                <img
                  src={getAvatar(wizard.avatar)?.image}
                  alt="user"
                  className="avatar-img"
                />
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <h3 className="text-lg mt-2">{wizard.name}</h3>
              <p className="text-desc fs-8">{wizard.description}</p>
            </div>
          </div>
          <div className="d-flex gap-1">
            <button className="el-btn-secondary" onClick={handleView}>
              View
            </button>
            <a
              className="el-btn-secondary"
              href={generateTwitterShareLink(
                `${TWITTER_SHARE_CONTENT(
                  wizard.name,
                  `${window.location.origin}/chat/${wizard.id}`
                )}`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"></path>
                </svg>
              </span>
              <span className="text-xs sub-title-color">Share</span>
            </a>
          </div>
        </div>

        <hr className="mt-2" />
      </header>
      <AgentDetails
        isOpen={true}
        onHide={() => setIsViewOpen(false)}
        wizard={wizard}
      />
    </>
  );
}

export default Header;
