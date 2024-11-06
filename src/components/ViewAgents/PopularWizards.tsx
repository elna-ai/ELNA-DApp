import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Spinner, Button, Form, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { useGetAllAnalytics } from "hooks/reactQuery/wizards/useAnalytics";

import Card from "./Card";
import { useFetchPublicWizards } from "hooks/reactQuery/wizards/usePublicWizards";
import { WizardDetailsBasicWithTimeStamp } from "declarations/wizard_details/wizard_details.did";
import classNames from "classnames";
import { SearchIcon } from "src/assets/searchIcon";

type SortByOptions = "popularity" | "recentlyUpdated";

function PopularWizards() {
  const [sortBy, setSortBy] = useState<SortByOptions>("recentlyUpdated");
  const { t } = useTranslation();

  const [suggestionResults, setSuggestionResults] = useState<Array<WizardDetailsBasicWithTimeStamp>>([]);
  const [suggestionActive, setSuggestionActive] = useState<Boolean>(false);
  const [searchButtonActive, setSearchButtonActive] = useState<Boolean>(false);
  const [clearInputButtonActive, setClearInputButtonActive] = useState<Boolean>(false);
  const searchQueryRef = useRef<HTMLInputElement>(null);

  const {
    data: popularWizards,
    isFetching: isLoadingPopularWizards,
    isError,
    error,
  } = useFetchPublicWizards();
  const { data: analytics } = useGetAllAnalytics();

  const sortWizards = (
    popularWizards: WizardDetailsBasicWithTimeStamp[] | undefined,
    sortBy: SortByOptions
  ) => {
    if (popularWizards === undefined) return undefined;

    //test solution
    let chosenWizardArray;
    if(searchButtonActive) chosenWizardArray = suggestionResults; else chosenWizardArray = popularWizards

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

  function searchWizards(
    popularWizards: WizardDetailsBasicWithTimeStamp[] | undefined,
    searchQuery: string
  ) {
    if (popularWizards === undefined) return undefined;
    if (searchQuery === "") {
      setSuggestionResults([]);
      return undefined
    }

    const results = popularWizards.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestionResults(results);
  };

  useEffect(() => {
    if (!isError) return;

    console.error(error);
    toast.error(error.message);
  }, [isError]);

  useEffect(() => {
    console.log(clearInputButtonActive)
  }, [clearInputButtonActive]);

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
        <div className="mb-3 d-flex align-items-center gap-3">
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
          <div className="position-relative w-100 d-flex align-items-center">
            <Form.Control
              onChange={e => {
                if(e.target.value === "") {
                  setSearchButtonActive(false);
                  setClearInputButtonActive(false)
                }
                setSuggestionActive(true)
                searchWizards(popularWizards, e.target.value)
                setClearInputButtonActive(true)
              }}
              onFocus={() => {
                setSuggestionActive(true)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if(searchQueryRef.current === null) return;
                  setSearchButtonActive(true);
                  setSuggestionActive(false);
                }
              }}
              onBeforeInput={() => setSearchButtonActive(false)}
              style={{ color: "#fff" }}
              placeholder="Agent Search"
              aria-label="Agent Search"
              aria-describedby="basic-addon1"
              ref={searchQueryRef}
            />
            {
              clearInputButtonActive && searchQueryRef.current && searchQueryRef.current?.value.length > 0 &&
              <Button onClick={() => {
                if(searchQueryRef.current === null) return;
                searchQueryRef.current.value = ""
                setClearInputButtonActive(false)
              }}
              variant="tertiary"
              className="position-absolute end-0 text-light"
              >X</Button>
            }
              <ListGroup className="position-absolute top-100 mt-1 z-2">
                {
                  suggestionActive ?
                    suggestionResults?.map(wizard => (
                      <Link to={`/chat/${wizard?.id}`} key={wizard?.id}>
                        <ListGroup.Item 
                          key={wizard.id} 
                          action variant="secondary"
                          onClick={() => {
                            if(searchQueryRef.current === null) return;
                            searchWizards(popularWizards, searchQueryRef.current.value)
                            searchQueryRef.current.value = wizard?.name;
                            setSuggestionActive(false)
                          }}
                          >
                          <SearchIcon strokeValue="#000"/>{wizard?.name}
                        </ListGroup.Item>
                      </Link>
                    )) : null
                }
              </ListGroup>
          </div>
          <Button 
              variant="secondary"
              onClick={() => {
              if(searchQueryRef.current === null) return;
              setSearchButtonActive(true);
              setSuggestionActive(false);
            }} 
            className="btn btn-icon btn-rounded btn-flush-dark flush-soft-hover">
            <SearchIcon strokeValue="#fff"/>
          </Button>

        </div>
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
                  imageId={avatar}
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
