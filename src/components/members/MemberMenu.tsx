// import React from "react";
import { Link } from "react-router-dom";

export default function MemberMenu() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Dashboard</Link>
      <Link to="/edit-profile" style={{ marginRight: "1rem" }}>Edit Profile</Link>
      <Link to="/logout">Logout</Link>
    </nav>
  );
}
