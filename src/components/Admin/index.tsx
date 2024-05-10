import { Routes, Route } from "react-router-dom";
import WhitelistUsers from "./Whitelist";
import Agents from "./Agents";
import PendingDevelopers from "./PendingDevelopers";

function AdminDashboard() {
  return (
    <Routes>
      <Route path="/whitelist" element={<WhitelistUsers />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/pending-developer" element={<PendingDevelopers />} />
      <Route path="/" element={<div>Admin panel</div>} />
    </Routes>
  );
}

export default AdminDashboard;
