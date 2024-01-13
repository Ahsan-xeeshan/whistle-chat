/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import firebaseConfig from "./Authentication/firebaseConfig.jsx";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword.jsx";
import Home from "./Components/Home/Home.jsx";
import LogIn from "./Components/LogIn/LogIn.jsx";
import Message from "./Components/Message/Message.jsx";
import Registration from "./Components/Registration/Registration.jsx";
import "./index.css";
import store from "./Store.jsx";
console.log(firebaseConfig);
const router = createBrowserRouter([
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/",
    element: <LogIn />,
  },
  {
    path: "/forgotPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/message",
    element: <Message />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
