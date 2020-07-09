import React from "react";

const SetAppStateContext = React.createContext();

function useSetAppState() {
  const context = React.useContext(SetAppStateContext);
  if (!context) {
    throw new Error("useSetAppState must be used within SetAppStateProvider");
  }
  return context;
}

function SetAppStateProvider(props) {
  const { setAppState } = props;
  const value = React.useMemo(() => setAppState||[], [setAppState]);
  return <SetAppStateContext.Provider value={value} {...props} />;
}

export { SetAppStateProvider, useSetAppState };
