import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ProfilePopup = ({ onClose, onSaved, existingData }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    college: "",
    address: ""
  });

  useEffect(() => {
    if (existingData) {
      setForm({
        full_name: existingData.full_name || "",
        email: existingData.email || "",
        phone: existingData.phone || "",
        gender: existingData.gender || "",
        college: existingData.college || "",
        address: existingData.address || ""
      });
    }
  }, [existingData]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    if (!form.full_name || !form.phone || !form.gender || !form.college) {
      alert("Please fill all mandatory fields");
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach(k => fd.append(k, form[k]));

    const res = await fetch("http://localhost:4000/profile/save", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: fd
    });

    const data = await res.json();

    if (data.success) {
      onSaved();      // refresh profile data
      onClose();      // close popup
      navigate("/dashboard/profilepage"); // ✅ WORKING PATH
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={e => e.stopPropagation()}>
        <h3>Complete Profile</h3>

        <input
          name="full_name"
          placeholder="Full Name *"
          value={form.full_name}
          onChange={handleChange}
        />

        {/* 🔒 LOCKED EMAIL */}
        <input
          name="email"
          type="email"
          value={form.email}
          readOnly
          style={{ background: "#f3f4f6", cursor: "not-allowed" }}
        />

        <input
          name="phone"
          placeholder="Phone *"
          value={form.phone}
          onChange={handleChange}
        />

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Gender *</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          name="college"
          placeholder="College *"
          value={form.college}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <div className="popup-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={saveProfile}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
