import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import NoChatBotImg from "images/no-chatbot.png";
import { wizard_details as wizardDetails } from "declarations/wizard_details";
import { WizardDetailsBasic } from "declarations/wizard_details/wizard_details.did";
import { useWallet } from "hooks/useWallet";
import { getAvatar } from "src/utils";

import Card from "./Card";

function MyWizards() {
  const [isUserWizardsLoading, setIsUserWizardsLoading] = useState(true);
  const [userWizards, setUserWizards] = useState<WizardDetailsBasic[]>([]);

  const { t } = useTranslation();
  const wallet = useWallet();

  const getUserWizards = async (userId?: string) => {
    if (userId === undefined) return;

    try {
      setIsUserWizardsLoading(true);
      const data = await wizardDetails.getUserWizards(userId);
      setUserWizards(data);
      setIsUserWizardsLoading(false);
    } catch (e) {
      toast.error("Something went wrong!");
      console.error(e);
    }
  };

  useEffect(() => {
    if (wallet?.principalId === undefined) return;

    getUserWizards(wallet?.principalId);
  }, []);

  return (
    <>
      <h5 className="flex gap-2">
        <span>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              d="M17.0007 1.20801 18.3195 3.68083 20.7923 4.99968 18.3195 6.31852 17.0007 8.79134 15.6818 6.31852 13.209 4.99968 15.6818 3.68083 17.0007 1.20801ZM8.00065 4.33301 10.6673 9.33301 15.6673 11.9997 10.6673 14.6663 8.00065 19.6663 5.33398 14.6663.333984 11.9997 5.33398 9.33301 8.00065 4.33301ZM19.6673 16.333 18.0007 13.208 16.334 16.333 13.209 17.9997 16.334 19.6663 18.0007 22.7913 19.6673 19.6663 22.7923 17.9997 19.6673 16.333Z"
              fill="#ffc107"
            ></path>
          </svg>
        </span>
        {t("wizards.myWizards")}
      </h5>
      {isUserWizardsLoading ? (
        <Spinner className="!flex mx-auto" />
      ) : userWizards?.length > 0 ? (
        <div className="row gx-3 row-cols-xxl-6 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5">
          {userWizards?.map(({ id, name, description, avatar }) => (
            <div key={id} className="col">
              <Card
                name={name}
                description={description}
                id={id}
                imageUrl={getAvatar(avatar)!.image}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-100 bg-elavate py-5 text-center rounded-3">
          <img className="d-inline" src={NoChatBotImg} alt="no wizard" />
          <p>{t("wizards.noWizards")}</p>
        </div>

      )}
      <hr />
    </>
  );
}

export default MyWizards;
