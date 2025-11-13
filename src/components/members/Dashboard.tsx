import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard | Network of American Mensa Member Experts";
  }, []);
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Secret Dashboard Page</h1>
      <p>Accessible only when authenticated.</p>
    </div>
  );
}
