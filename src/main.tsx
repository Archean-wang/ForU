import ReactDOM from "react-dom/client";
import "./styles.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./route";
import Config from "./components/config";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Config>
    <RouterProvider router={router} />
  </Config>
  // </React.StrictMode>
);
