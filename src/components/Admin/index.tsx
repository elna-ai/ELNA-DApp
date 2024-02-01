import { Routes, Route } from "react-router-dom";
import WhitelistUsers from "./Whitelist";
import Agents from "./Agents";

function AdminDashboard() {
  return (
    <Routes>
      <Route path="/whitelist" element={<WhitelistUsers />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/" element={<div>Admin panel</div>} />
    </Routes>
  );
}

export default AdminDashboard;
