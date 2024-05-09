import { Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import DeveloperRequest from "./DeveloperRequest";

function Profile() {
  return (
    <Routes>
      <Route path="/" element={<Summary />} />
      <Route path="/request/developer" element={<DeveloperRequest />} />
    </Routes>
  );
}

export default Profile;
