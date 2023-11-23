import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { AVATAR_DUMMY_IMAGE } from "components/Chat/constants";
import { wizard_details as wizardDetails } from "declarations/wizard_details";
import { WizardDetailsBasic } from "declarations/wizard_details/wizard_details.did";

import Card from "./Card";

function PopularWizards() {
  const [isPopularWizardsLoading, setIsPopularWizardsLoading] = useState(true);
  const [popularWizards, setPopularWizards] = useState<WizardDetailsBasic[]>(
    []
  );

  const { t } = useTranslation();

  const getPopularWizards = async () => {
    try {
      setIsPopularWizardsLoading(true);
      const data = await wizardDetails.getWizards();
      setPopularWizards(data);
      setIsPopularWizardsLoading(false);
    } catch (e) {
      toast.error("Something went wrong!");
      console.error(e);
    }
  };

  useEffect(() => {
    getPopularWizards();
  }, []);

  return (
    <>
      <div className="d-flex align-items-top justify-content-between mt-4 mb-2">
        <div>
          <h5 className="flex gap-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  d="M12 23C7.85786 23 4.5 19.6421 4.5 15.5C4.5 13.3462 5.40786 11.4045 6.86179 10.0366C8.20403 8.77375 11.5 6.49951 11 1.5C17 5.5 20 9.5 14 15.5C15 15.5 16.5 15.5 19 13.0296C19.2697 13.8032 19.5 14.6345 19.5 15.5C19.5 19.6421 16.1421 23 12 23Z"
                  fill="rgba(234,113,46,1)"
                ></path>
              </svg>
            </span>
            {t("wizards.popularWizards")}
          </h5>
          <p>{t("wizards.popularWizardsDesc")}</p>
        </div>
        <a href="#" className="fs-7 flex-shrink-0">
          <u>{t("common.viewAll")}</u>
        </a>
      </div>
      <div className="row gx-3 row-cols-xxl-6 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5">
        {isPopularWizardsLoading ? (
          <Spinner className="m-auto" />
        ) : (
          // avatar
          popularWizards?.map(({ id, name, userId, description }) => {
            const imgUrl =
              AVATAR_DUMMY_IMAGE.find(dummy => dummy.id === id)?.imgUrl ||
              AVATAR_DUMMY_IMAGE[0].imgUrl;
            return (
              <Card
                {...{ name, description }}
                id={id}
                key={id}
                imageUrl={imgUrl}
                userId={userId}
              />
            );
          })
        )}
      </div>
    </>
  );
}

export default PopularWizards;
