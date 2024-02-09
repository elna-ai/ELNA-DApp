import { t } from "i18next";
import CheckWizardNameCreateModal from "components/common/CheckWizardNameCreate";

import TemplateStore from "./TemplateSore";

function View() {
  return (
    <div className="w-100">
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
                  d="M15.2238 15.5078L13.0111 20.1579C12.8687 20.4572 12.5107 20.5843 12.2115 20.4419C12.1448 20.4102 12.0845 20.3664 12.0337 20.3127L8.49229 16.574C8.39749 16.4739 8.27113 16.4095 8.13445 16.3917L3.02816 15.7242C2.69958 15.6812 2.46804 15.3801 2.51099 15.0515C2.52056 14.9782 2.54359 14.9074 2.5789 14.8425L5.04031 10.3191C5.1062 10.198 5.12839 10.0579 5.10314 9.92241L4.16 4.85979C4.09931 4.53402 4.3142 4.22074 4.63997 4.16005C4.7126 4.14652 4.78711 4.14652 4.85974 4.16005L9.92237 5.10319C10.0579 5.12843 10.198 5.10625 10.319 5.04036L14.8424 2.57895C15.1335 2.42056 15.4979 2.52812 15.6562 2.81919C15.6916 2.88409 15.7146 2.95495 15.7241 3.02821L16.3916 8.13449C16.4095 8.27118 16.4739 8.39754 16.5739 8.49233L20.3127 12.0337C20.5533 12.2616 20.5636 12.6414 20.3357 12.8819C20.2849 12.9356 20.2246 12.9794 20.1579 13.0111L15.5078 15.2238C15.3833 15.2831 15.283 15.3833 15.2238 15.5078ZM16.0206 17.4349L17.4348 16.0207L21.6775 20.2633L20.2633 21.6775L16.0206 17.4349Z"
                  fill="#ffc107"
                ></path>
              </svg>
            </span>{" "}
            Create an Agent
          </h5>
          <p>{t("createAgent.title")}</p>
        </div>
      </div>
      <div className="row gx-3 row-cols-xxl-4 row-cols-xl-2 row-cols-lg-2 row-cols-md-2 row-cols-1 mb-5">
        <div className="col">
          <div className="card card-border contact-card elna-card agent-create">
            <div className="card-body text-center">
              <div className="d-inline-flex ic-agent-create p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11H7V13H11V17H13V13H17V11H13V7H11V11Z"
                    fill="#00d67f"
                  ></path>
                </svg>
              </div>
              <div className="user-name mt-1 mb-1">
                <CheckWizardNameCreateModal>
                  <div className="btn-link stretched-link text-decoration-none">
                    {t("createAgent.fromStrach")}
                  </div>
                </CheckWizardNameCreateModal>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <TemplateStore />
    </div>
  );
}

export default View;
