import { Routes, Route } from "react-router-dom";
import View from "./View";
import Create from "./Create";

function CreateAgent() {
  return (
    <Routes>
      <Route path="/" element={<View />} />
      <Route path="/edit/:uuid?" element={<Create />} />
    </Routes>
  );
}

export default CreateAgent;
