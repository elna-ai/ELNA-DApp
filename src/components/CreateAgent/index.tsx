import { Routes, Route } from "react-router-dom";
import View from "./View";
import Create from "./Create";
import Integrations from "./Integrations";

function CreateAgent() {
  return (
    <Routes>
      <Route path="/" element={<View />} />
      <Route path="/edit/:uuid?" element={<Create />} />
      <Route path="/integrations/:uuid?" element={<Integrations />} />
    </Routes>
  );
}

export default CreateAgent;
