import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import MetaTags from "components/common/MetaHelmet";
import { t } from "i18next";

function DeveloperStudio() {
  return (
    <>
      <MetaTags
        title={t("meta.developerStudio.title")}
        description={t("meta.developerStudio.description")}
      />
      <Routes>
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default DeveloperStudio;
