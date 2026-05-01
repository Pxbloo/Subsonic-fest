import React from "react";

const AppLink = ({ href = "#", children, className = "" }) => {
  return (
    <a
      href={href}
      className={`text-subsonic-text font-bold hover:text-subsonic-btn transition ${className}`}
    >
      {children}
    </a>
  );
};

export default AppLink;