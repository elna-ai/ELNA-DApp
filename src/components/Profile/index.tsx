import { Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import DeveloperRequest from "./DeveloperRequest";
import AddDetails from "./AddDetails";

function Profile() {
  return (
    <Routes>
      <Route path="/" element={<Summary />} />
      <Route path="/request/developer" element={<DeveloperRequest />} />
      <Route path="/add" element={<AddDetails />} />
    </Routes>
  );
}

export default Profile;
