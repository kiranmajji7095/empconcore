import { useEffect, useState } from "react";
import ProfilePopup from "../profilepopup";
import "./index.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchProfile = async () => {
  const res = await fetch("http://localhost:4000/profile/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();

  if (data.success && data.profile) {
    setProfile(data.profile);

    if (
      !data.profile.full_name ||
      !data.profile.phone ||
      !data.profile.college ||
      !data.profile.gender
    ) {
      setShowPopup(true);
    }
  } else {
    // 👇 NO PROFILE YET → OPEN POPUP
    setProfile(null);
    setShowPopup(true);
  }
};


  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      {profile && profile.full_name && !showPopup && (
        <div className="profile-card">
          <h2>My Profile</h2>

          <p><b>Name:</b> {profile.full_name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Phone:</b> {profile.phone}</p>
          <p><b>Gender:</b> {profile.gender}</p>
          <p><b>College:</b> {profile.college}</p>
          <p><b>Address:</b> {profile.address || "-"}</p>

          {/* 📄 RESUME */}
          {profile.resume && (
            <a
              href={`http://localhost:4000/${profile.resume}`}
              target="_blank"
              rel="noreferrer"
            >
              View Resume
            </a>
          )}

          <button className="btn-edit" onClick={() => setShowPopup(true)}>
            Edit Profile
          </button>
        </div>
      )}

      {showPopup && (
        <ProfilePopup
          existingData={profile}
          onSaved={fetchProfile}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
