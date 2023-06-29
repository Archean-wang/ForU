import { useEffect } from "react";
import { getAccessToken } from "../../utils/authentication";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

function Callback() {
  const store = useStore();
  const navigate = useNavigate();
  console.log("我渲染啦");

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
        console.log(e);
      }
    }
  }, [store.loginStore.login]);

  return <>{`登录中...${store.loginStore.login}`}</>;
}

export default observer(Callback);
