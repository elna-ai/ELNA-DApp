import { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { toast } from "react-toastify";

import { WizardDetailsBasicWithCreatorName } from "declarations/wizard_details/wizard_details.did";

import CloseIcon from "src/assets/close_icon.svg?react";
import SearchIcon from "src/assets/search_icon.svg?react";

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

function SearchBarWizards({
  popularWizards,
  setSearchButtonActive,
  suggestionResults,
  setSuggestionResults,
}: {
  popularWizards: WizardDetailsBasicWithCreatorName[];
  setSearchButtonActive: React.Dispatch<React.SetStateAction<boolean>>;
  suggestionResults: WizardDetailsBasicWithCreatorName[];
  setSuggestionResults: React.Dispatch<
    React.SetStateAction<Array<WizardDetailsBasicWithCreatorName>>
  >;
}) {
  const navigate = useNavigate();

  const [suggestionActive, setSuggestionActive] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const searchQueryRef = useRef<HTMLInputElement>(null);

  function searchWizards(
    popularWizards: WizardDetailsBasicWithCreatorName[],
    searchQuery: string
  ) {
    if (popularWizards === undefined) return undefined;
    if (searchQuery === "") {
      setSuggestionResults([]);
      return undefined;
    }

    const results = popularWizards.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    setSuggestionResults(results);
  }

  function inputOnchange(e: React.ChangeEvent<FormControlElement>) {
    if (e.target.value === "") {
      setSearchButtonActive(false);
    }
    setSuggestionActive(true);
    searchWizards(popularWizards, e.target.value);
  }

  function inputOnFocus() {
    if (searchQueryRef.current === null) return;
    if (searchQueryRef.current.value === "" && suggestionActive)
      setSuggestionActive(false);
  }

  function inputOnKeyDown(e: React.KeyboardEvent<FormControlElement>) {
    if (searchQueryRef.current === null || searchQueryRef.current?.value === "")
      return;
    if (!suggestionActive) return;
    if (e.key === "Enter") {
      noResultToast();
      if (suggestionIndex !== -1)
        navigate(`/chat/${suggestionResults[suggestionIndex]?.id}`);
      else {
        setSearchButtonActive(true);
        setSuggestionActive(false);
      }
    }
    if (e.key === "ArrowDown") {
      setSuggestionIndex(prev => Number(prev) + 1);
    }
    if (e.key === "ArrowUp") {
      setSuggestionIndex(prev => Number(prev) - 1);
    }
  }

  function searchButtonOnClick() {
    if (searchQueryRef.current === null || searchQueryRef.current?.value === "") return;
    noResultToast();
    setSearchButtonActive(true);
    setSuggestionActive(false);
  }

  function noResultToast() {
    if (suggestionResults.length === 0) toast("No matching agents found");
  }

  return (
    <div className="d-flex align-items-center w-full gap-3">
      <div className="position-relative w-full max-w-500p d-flex align-items-center">
        <Form.Control
          onChange={e => inputOnchange(e)}
          onKeyDown={e => inputOnKeyDown(e)}
          onFocus={() => inputOnFocus()}
          onBlur={() => setTimeout(() => setSuggestionActive(false), 100)}
          onBeforeInput={() => setSearchButtonActive(false)}
          style={{ color: "#fff" }}
          placeholder="Agent Search"
          aria-label="Agent Search"
          ref={searchQueryRef}
        />
        {!!searchQueryRef.current?.value && (
          <Button
            onClick={() => {
              if (searchQueryRef.current === null) return;
              searchQueryRef.current.value = "";
            }}
            variant="tertiary"
            className="position-absolute end-0 text-light"
          >
            <div className="stroke-light w-4 d-flex align-items-center">
              <CloseIcon />
            </div>
          </Button>
        )}
        <div className="suggestion__list">
          {suggestionActive
            ? suggestionResults?.slice(0, 15)?.map((wizard, index) => (
              <Link
                to={`/chat/${wizard?.id}`}
                className={classNames("suggestion__item", {
                  "suggestion__item--highlight": suggestionIndex === index,
                })}
                key={index}
              >
                <div className="stroke-dark w-4 d-flex align-items-center">
                  <SearchIcon />
                </div>
                {wizard?.name}
              </Link>
            ))
            : null}
        </div>
      </div>
      <Button
        variant="secondary"
        onClick={() => searchButtonOnClick()}
        className="btn btn-icon btn-rounded btn-flush-dark flush-soft-hover"
      >
        <div className="stroke-light w-4 h-4">
          <SearchIcon />
        </div>
      </Button>
    </div>
  );
}

export default SearchBarWizards;
