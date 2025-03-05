import ReactDOM from "react-dom/client";
import store from "./redux/store.js";

import App from "./App.jsx";
import { Provider } from "react-redux";

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(
<Provider store ={store}>
    <App/>

</Provider>
);
