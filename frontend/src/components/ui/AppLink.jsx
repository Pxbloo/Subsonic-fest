import React from "react";
import { Link } from 'react-router-dom';

const AppLink = ({ href = "#", children, className = "" }) => {
  return (
    <Link
      to={href}
      className={`text-subsonic-text font-bold hover:text-subsonic-btn transition ${className}`}
    >
      {children}
    </Link>
  );
};

export default AppLink;