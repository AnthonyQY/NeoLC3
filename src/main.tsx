import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Circle2 } from "react-preloaders";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <>
      <App />
      <Circle2
        customLoading={false}
        time={0}
        background="#121212"
        color={"#55C39E"}
      />
    </>
  </React.StrictMode>
);
