import { Routes, Route } from "react-router-dom";
import WhitelistUsers from "./Whitelist";

function AdminDashboard() {
  return (
    <Routes>
      <Route path="/whitelist" element={<WhitelistUsers />} />
      <Route path="/" element={<div>Admin panel</div>} />
    </Routes>
  );
}

export default AdminDashboard;
