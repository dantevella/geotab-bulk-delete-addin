import React from "react";

const IsLoadingContext = React.createContext();

function useIsLoading() {
  const context = React.useContext(IsLoadingContext);
  if (context===undefined) {
    throw new Error("useIsLoading must be used within IsLoadingProvider");
  }
  return context;
}

function IsLoadingProvider(props) {
  const { isLoading } = props;
  const value = React.useMemo(() => isLoading, [isLoading]);
  return <IsLoadingContext.Provider value={value} {...props} />;
}

export { IsLoadingProvider, useIsLoading };