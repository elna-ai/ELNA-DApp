import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useGenerateUserToken } from "hooks/reactQuery/useUser";
import { useUserStore } from "stores/useUser";
import {
  useWizardGetFileNames,
  useLogin,
} from "hooks/reactQuery/useExternalService";
import { useWallet } from "hooks/useWallet";
import { v4 as uuidv4 } from "uuid";

import Card from "./Card";
import UploadFile from "./UploadFile";

type KnowledgeProps = { wizardId: string };

function Knowledge({ wizardId }: KnowledgeProps) {
  const [isAddDocument, setIsAddDocument] = useState(false);

  const { t } = useTranslation();
  const wallet = useWallet();
  const userToken = useUserStore(state => state.userToken);
  const { mutate: generateUserToken } = useGenerateUserToken();
  const { mutate: loginExternalService } = useLogin();
  const { data: documents } = useWizardGetFileNames(wizardId);

  useEffect(() => {
    !userToken && generateUserToken();
  }, [userToken]);

  useEffect(() => {
    if (Cookies.get("external_token")) return;
    if (!userToken) return;
    if (!wallet?.principalId) return;

    loginExternalService({ token: userToken, principalId: wallet.principalId });
  }, [userToken, wallet?.principalId]);

  return (
    <div>
      <div>
        <h3 className="sub-title-bot">{t("createAgent.knowledge.title")}</h3>
        <span className="fs-7">{t("createAgent.knowledge.description")}</span>
      </div>
      <div className="d-flex gap-2 mt-4">
        <Button className="btn-knowledge" disabled>
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                d="M18.3643 15.5353L16.95 14.1211L18.3643 12.7069C20.3169 10.7543 20.3169 7.58847 18.3643 5.63585C16.4116 3.68323 13.2458 3.68323 11.2932 5.63585L9.87898 7.05007L8.46477 5.63585L9.87898 4.22164C12.6127 1.48797 17.0448 1.48797 19.7785 4.22164C22.5121 6.95531 22.5121 11.3875 19.7785 14.1211L18.3643 15.5353ZM15.5358 18.3638L14.1216 19.778C11.388 22.5117 6.9558 22.5117 4.22213 19.778C1.48846 17.0443 1.48846 12.6122 4.22213 9.87849L5.63634 8.46428L7.05055 9.87849L5.63634 11.2927C3.68372 13.2453 3.68372 16.4112 5.63634 18.3638C7.58896 20.3164 10.7548 20.3164 12.7074 18.3638L14.1216 16.9496L15.5358 18.3638ZM14.8287 7.75717L16.2429 9.17139L9.17187 16.2425L7.75766 14.8282L14.8287 7.75717Z"
                fill="var(--elna-primary-text-color)"
              ></path>
            </svg>
          </span>
          {t("createAgent.knowledge.addWebpages")}
        </Button>
        <Button
          className="btn-knowledge"
          onClick={() => setIsAddDocument(true)}
          disabled={documents?.length}
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"
                fill="var(--elna-primary-text-color)"
              ></path>
            </svg>
          </span>
          {t("createAgent.knowledge.addDocuments")}
        </Button>
      </div>
      <span className="mt-2 text-center fs-7">{t("common.comingSoon")}</span>
      <div className="mt-4 row gx-3 row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5">
        {documents?.length > 0 &&
          documents.map((document: string) => (
            <Card key={uuidv4()} title={document} isLearning={false} />
          ))}
      </div>
      <UploadFile
        isOpen={isAddDocument}
        onClose={() => setIsAddDocument(false)}
        agentId={wizardId}
      />
    </div>
  );
}

export default Knowledge;
