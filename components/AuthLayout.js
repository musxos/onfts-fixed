import { useEffect, useRef } from "react";
import Router from "next/router";

export const onAuthSuccess = () => {
  Router.push("/manage-whitelist");
};
export const onUnAuthorized = () => {
  Router.push("/manage-whitelist/auth");
};

export const AuthLayout = ({
  children,
  isAuthenticated,
  isAuthSuccessCheck = true,
}) => {
  const isEffectHookInit = useRef(false);

  useEffect(() => {
    if (isEffectHookInit.current) return;
    isEffectHookInit.current = true;
    isAuthSuccessCheck && isAuthenticated && onAuthSuccess();

    !isAuthenticated && onUnAuthorized();
  }, [isAuthenticated, isAuthSuccessCheck]);
  return <>{children}</>;
};
