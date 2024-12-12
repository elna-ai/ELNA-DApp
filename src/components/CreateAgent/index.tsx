import { Routes, Route } from "react-router-dom";
import Create from "./Create";

function CreateAgent() {
  return (
    <Routes>
      <Route path="/edit/:uuid?" element={<Create />} />
    </Routes>
  );
}

export default CreateAgent;
