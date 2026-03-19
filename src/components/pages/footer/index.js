import React from "react";
import "../../styles/footer.css";

const FooterBar = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bdftr-wrapper">
      <div className="bdftr-content">
        <p className="bdftr-text">
          © {currentYear} BeeData Technologies — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterBar;
