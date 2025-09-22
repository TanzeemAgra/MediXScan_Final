import React, { Fragment } from "react";

// Redux Selector / Action
import { useDispatch } from "react-redux";

// import state selectors
import {
  setSetting
} from "./store/setting/actions";

// RBAC Provider
import { RBACProvider } from "./hooks/useRBAC.jsx";
import { SessionTimeoutHandler } from "./components/RBACMiddleware";

function App({ children }) {
  const dispatch = useDispatch();
  dispatch(setSetting());
  
  return (
    <RBACProvider>
      <SessionTimeoutHandler>
        <div className="App">{children}</div>
      </SessionTimeoutHandler>
    </RBACProvider>
  )
}

export default App
