import {Navigate} from 'react-router-dom';
import React from 'react';
import {ROUTE_CONFIG} from './use-app-routes.ts';

type PrivateRouteProps = {
    children: React.ReactNode;
    hasAccess: boolean;
}

export default function PrivateRoute({children, hasAccess}: PrivateRouteProps) {

  return hasAccess ? children : <Navigate to={ROUTE_CONFIG.LOGIN}/>;
}

