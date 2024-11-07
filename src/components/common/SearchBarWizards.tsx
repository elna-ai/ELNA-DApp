import { useState, useRef } from "react";
import { ListGroup, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { WizardDetailsBasicWithTimeStamp } from "declarations/wizard_details/wizard_details.did";

import CloseIcon from "src/assets/close_icon.svg?react";
import SearchIcon from "src/assets/search_icon.svg?react";

function SearchBarWizards(
    {popularWizards, setSearchButtonActive, suggestionResults, setSuggestionResults}: 
    {
        popularWizards: WizardDetailsBasicWithTimeStamp[] | undefined,
        setSearchButtonActive: React.Dispatch<React.SetStateAction<Boolean>>
        suggestionResults: WizardDetailsBasicWithTimeStamp[] | undefined
        setSuggestionResults: React.Dispatch<React.SetStateAction<Array<WizardDetailsBasicWithTimeStamp>>>
    }
) {
    
    const [suggestionActive, setSuggestionActive] = useState<Boolean>(false);
    const [clearInputButtonActive, setClearInputButtonActive] = useState<Boolean>(false);
    const searchQueryRef = useRef<HTMLInputElement>(null);

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
        )
        //messagesReplied to be added to WizardDetailsBasicWithTimeStamp interface
        // .sort((a, b) => {
        //   const aMessagesReplied = parseInt(a.messagesReplied.replace('n', ''));
        //   const bMessagesReplied = parseInt(b.messagesReplied.replace('n', ''));
        //   if (isNaN(aMessagesReplied) || isNaN(bMessagesReplied)) {
        //     return 0; 
        //   } else {
        //     return bMessagesReplied - aMessagesReplied;
        //   }
        // });
    
        setSuggestionResults(results);
      };

    
  return (
        <>
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
                if(searchQueryRef.current === null) return;
                if(searchQueryRef.current.value === "" && suggestionActive) setSuggestionActive(false);
                setSuggestionActive(true)
              }}
              onBlur={() => setSuggestionActive(false)}
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
              ><div className="stroke-light w-4 d-flex align-items-center"><CloseIcon/></div></Button>
              
            }
              <ListGroup className="position-absolute top-100 mt-1 z-2">
                {
                  suggestionActive ?
                    suggestionResults?.slice(0,15)?.map((wizard) => (
                      <Link to={`/chat/${wizard?.id}`} key={wizard?.id}>
                        <ListGroup.Item 
                        className="d-flex align-items-center gap-3"
                        key={wizard.id} 
                        action variant="secondary"
                        onClick={() => {
                          if(searchQueryRef.current === null) return;
                          searchWizards(popularWizards, searchQueryRef.current.value)
                          searchQueryRef.current.value = wizard?.name;
                          setSuggestionActive(false)
                        }}
                        >
                          <div className="stroke-dark w-4 d-flex align-items-center"><SearchIcon/></div>
                          {wizard?.name}
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
            <div className="stroke-light w-4 h-4"><SearchIcon/></div>
          </Button>
        </>
    )   
}

export default SearchBarWizards
