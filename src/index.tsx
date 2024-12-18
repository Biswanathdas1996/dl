import React from "react";
import App from "./App";
import "./App.css";
import { HashRouter } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import "./css/one.css";
import "./css/two.css";
import "./css/three.css";
import "./css/four.css";
import "./css/five.css";
import "./css/six.css";
import "./css/seven.css";
import "./css/eight.css";
import "./css/nine.css";
import "./css/ten.css";
import "./css/eleven.css";
import "./css/twelve.css";
import "./css/thirteen.css";

import { Provider } from "react-redux";
import { store } from "./redux/store";

const rootElement = document.getElementById("app");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  );
} else {
  console.error("Failed to find the root element");
}
