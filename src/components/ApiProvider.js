import React from "react";

const ApiContext = React.createContext();

function useApi() {
  const context = React.useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within ApiProvider");
  }
  return context;
}

function ApiProvider(props) {
  const { api} = props;
  const value = React.useMemo(() => api||[], [api]);
  return <ApiContext.Provider value={value} {...props} />;
}

export { ApiProvider, useApi };
