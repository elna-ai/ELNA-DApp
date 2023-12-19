import { useTranslation } from "react-i18next";

import Card from "./Card";
import { TEMPLATE_BOTS } from "./constants";

function TemplateStore() {
  const { t } = useTranslation();

  return (
    <>
      <div className="d-flex align-items-top justify-content-between mt-6 mb-5">
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
                  d="M4 2.99658H20C20.5523 2.99658 21 3.4443 21 3.99658V8.99658C21 9.54887 20.5523 9.99658 20 9.99658H4C3.44772 9.99658 3 9.54887 3 8.99658V3.99658C3 3.4443 3.44772 2.99658 4 2.99658ZM6 11.9966H12C12.5523 11.9966 13 12.4443 13 12.9966V15.9966H14V21.9966H10V15.9966H11V13.9966H5C4.44772 13.9966 4 13.5489 4 12.9966V10.9966H6V11.9966ZM17.7322 13.7288L19.5 11.961L21.2678 13.7288C22.2441 14.7051 22.2441 16.288 21.2678 17.2643C20.2915 18.2407 18.7085 18.2407 17.7322 17.2643C16.7559 16.288 16.7559 14.7051 17.7322 13.7288Z"
                  fill="rgba(100,205,138,1)"
                ></path>
              </svg>
            </span>
            {t("createAgent.templateStore.title")}
          </h5>
          <p>{t("createAgent.templateStore.description")}</p>
        </div>
        <div>
          <a href="#" className="el-btn-secondary">
            {t("common.viewAll")}
          </a>
        </div>
      </div>
      <div className="row gx-3 row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5">
        {TEMPLATE_BOTS.map(bot => (
          <div key={bot.id} className="col">
            <Card bot={bot} />
          </div>
        ))}
      </div>
    </>
  );
}

export default TemplateStore;
