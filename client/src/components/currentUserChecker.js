import { useEffect, useContext } from "react";

import { CurrentUserContext } from "../contexts/currentUser";
import useSessionStorage from "../hooks/useSessionStorage";
import { useJwt } from "react-jwt";

const CurrentUserChecker = ({ children }) => {
  const [, dispatch] = useContext(CurrentUserContext);
  const [token] = useSessionStorage("token");
  const { decodedToken } = useJwt(token);

  useEffect(() => {
    if (!token) {
      dispatch({ type: "SET_UNAUTHORIZED" });
    } else {
      dispatch({ type: "SET_AUTHORIZED", payload: decodedToken });
    }
  }, [token, dispatch, decodedToken]);

  return children;
};

export default CurrentUserChecker;
