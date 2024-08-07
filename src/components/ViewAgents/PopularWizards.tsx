import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { getAvatar } from "src/utils";
import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";

import Card from "./Card";
import { useFetchPopularWizards } from "hooks/reactQuery/wizards/usePopularWizards";
import { WizardDetailsBasicWithTimeStamp } from "declarations/wizard_details/wizard_details.did";
import classNames from "classnames";

type SortByOptions = "popularity" | "recentlyUpdated";

function PopularWizards() {
  const [sortBy, setSortBy] = useState<SortByOptions>("recentlyUpdated");
  const { t } = useTranslation();
  const {
    data: popularWizards,
    isFetching: isLoadingPopularWizards,
    isError,
    error,
  } = useFetchPopularWizards();
  const { data: analytics } = useGetAllAnalytics();

  const sortWizards = (
    popularWizards: WizardDetailsBasicWithTimeStamp[] | undefined,
    sortBy: SortByOptions
  ) => {
    if (popularWizards === undefined) return undefined;

    let wizardsWithAnalytics = popularWizards.map(agent => ({
      ...agent,
      messagesReplied: analytics?.[agent.id]?.messagesReplied || 0n,
    }));
    if (sortBy === "popularity") {
      return wizardsWithAnalytics?.sort(
        (a, b) => Number(b.messagesReplied) - Number(a.messagesReplied)
      );
    } else {
      return wizardsWithAnalytics?.sort(
        (a, b) => Number(b.updatedAt) - Number(a.updatedAt)
      );
    }
  };

  useEffect(() => {
    if (!isError) return;

    console.error(error);
    toast.error(error.message);
  }, [isError]);

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
        <div>
          <a href="#" className="el-btn-secondary">
            {t("common.viewAll")}
          </a>
        </div>
      </div>
      {!isLoadingPopularWizards && popularWizards?.length && (
        <Dropdown className="mb-2">
          <Dropdown.Toggle variant="secondary">Sort</Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => setSortBy("recentlyUpdated")}
              active={sortBy === "recentlyUpdated"}
            >
              {t("common.recentlyUpdated")}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setSortBy("popularity")}
              active={sortBy === "popularity"}
            >
              {t("common.popularity")}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      <div className="row gx-3 row-cols-xxl-6 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5">
        {isLoadingPopularWizards ? (
          <Spinner className="m-auto" />
        ) : (
          <>
            {sortWizards(popularWizards, sortBy)?.map(
              ({ id, name, userId, description, avatar }) => (
                <Card
                  {...{ name, description }}
                  id={id}
                  key={id}
                  imageUrl={getAvatar(avatar)?.image}
                  userId={userId}
                  messagesReplied={analytics?.[id]?.messagesReplied || 0n}
                />
              )
            )}
          </>
        )}
      </div>
    </>
  );
}

export default PopularWizards;
