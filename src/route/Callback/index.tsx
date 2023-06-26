import { useEffect } from "react";
import { getAccessToken } from "../../utils/authentication";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";

function Callback() {
  const store = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const params = location.search.split("?")[1].split("&");
      const code = params[0].split("=")[1];
      getAccessToken(code);
    } catch (e) {
      console.log(e);
    } finally {
      store.loginStore.setLogin(true);
      navigate("/");
    }
  });
  return "登录中...";
}

export default Callback;
