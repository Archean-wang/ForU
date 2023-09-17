import { useEffect, useState } from "react";
import { getToken } from "../../utils/authentication";
import { useNavigate } from "react-router-dom";

function useAutoLogin() {
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!login) {
      getToken()
        .then(() => {
          setLogin(true);
        })
        .catch(() => {
          navigate("/login");
        });
    }
  }, [login]);

  return login;
}

export default useAutoLogin;
