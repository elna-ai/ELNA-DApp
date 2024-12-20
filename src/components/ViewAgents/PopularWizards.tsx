import { useEffect, useState } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";

import Card from "./Card";
import { useFetchPublicWizards } from "hooks/reactQuery/wizards/usePublicWizards";
import { WizardDetailsBasicWithCreatorName } from "declarations/wizard_details/wizard_details.did";
import SearchBarWizards from "./SearchBarWizards";
import MetaTags from "components/common/MetaHelmet";
import { t } from "i18next";

type SortByOptions = "popularity" | "recentlyUpdated";

function PopularWizards({ isHomePage }: { isHomePage: boolean }) {
  const [sortBy, setSortBy] = useState<SortByOptions>("recentlyUpdated");

  const [suggestionResults, setSuggestionResults] = useState<
    Array<WizardDetailsBasicWithCreatorName>
  >([]);
  const [searchButtonActive, setSearchButtonActive] = useState(false); //When data is displayed somewhere other than suggestions on search button click

  const {
    data: popularWizards,
    isFetching: isLoadingPopularWizards,
    isError,
    error,
  } = useFetchPublicWizards();
  const { data: analytics } = useGetAllAnalytics();

  const sortWizards = (
    popularWizards: WizardDetailsBasicWithCreatorName[] | undefined,
    sortBy: SortByOptions
  ) => {
    if (popularWizards === undefined) return undefined;

    const chosenWizardArray =
      searchButtonActive && suggestionResults.length
        ? suggestionResults
        : popularWizards;

    let wizardsWithAnalytics = chosenWizardArray.map(agent => ({
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
      <MetaTags
        title={t(`meta.${isHomePage ? "home" : "agentMarketplace"}.title`)}
        description={t(`meta.${isHomePage ? "home" : "agentMarketplace"}.description`)}
      />
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
          {
            isHomePage && <Link to="/agent-marketplace" className="el-btn-secondary">
              {t("common.viewAll")}
            </Link>
          }
        </div>
      </div>
      {!isLoadingPopularWizards && popularWizards?.length && !isHomePage && (
        <div className="mb-3 d-flex justify-content-between align-items-center gap-3">
          <SearchBarWizards
            popularWizards={popularWizards}
            setSearchButtonActive={setSearchButtonActive}
            suggestionResults={suggestionResults}
            setSuggestionResults={setSuggestionResults}
          />
          <Dropdown>
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
        </div>
      )}
      <div className="row g-3 row-cols-xxl-6 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5">
        {isLoadingPopularWizards ? (
          <Spinner className="m-auto" />
        ) : (
          <>
            {sortWizards(popularWizards, sortBy)
              ?.map(({ id, name, userId, description, avatar, creatorName }) => (
                <Card
                  {...{ name, description, creatorName }}
                  id={id}
                  key={id}
                  imageId={avatar}
                  userId={userId}
                  messagesReplied={analytics?.[id]?.messagesReplied || 0n}
                />
              ))
            }
          </>
        )}
      </div>
    </>
  );
}

export default PopularWizards;
