import { Routes, Route } from "react-router-dom";

function AdminDashboard() {
  return (
    <Routes>
      <Route path="/whitelist" element={<div>Whitlst</div>} />
      <Route path="/" element={<div>Admin panel</div>} />
    </Routes>
  );
}

export default AdminDashboard;
