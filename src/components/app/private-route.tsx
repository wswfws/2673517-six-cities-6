import {Navigate} from 'react-router-dom';
import React from "react";

export default function PrivateRoute({children}: { children: React.ReactNode }) {
  const hasAccess = false;

  return hasAccess ? children : <Navigate to={'/login'}/>;
}

