import { useEffect } from "react";
import { getAccessToken } from "../../utils/authentication";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

function Callback() {
  const store = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (store.loginStore.login) {
      navigate("/");
    } else {
      try {
        const params = location.search.split("?")[1].split("&");
        const code = params[0].split("=")[1];
        getAccessToken(code).then(() => {
          store.loginStore.setLogin(true);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [store.loginStore.login]);

  return <>{store.loginStore.login ? `登录成功` : `登录中...`}</>;
}

export default observer(Callback);
