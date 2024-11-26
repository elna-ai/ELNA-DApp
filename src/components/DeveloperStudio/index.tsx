import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import CreateTool from "./CreateTool";

function DeveloperStudio() {
  return (
    <Routes>
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

export default DeveloperStudio;
