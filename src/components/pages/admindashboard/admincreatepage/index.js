import { useState } from "react";

const AdminCreateUser = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const createUser = async () => {
   await fetch("http://localhost:4000/admin/role/update-role", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify({ email, role })
});


    alert("User created");
  };

  return (
    <div className="admin-form">
      <h1>Create User</h1>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <select onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="hr">HR</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={createUser}>Create</button>
    </div>
  );
};

export default AdminCreateUser;
