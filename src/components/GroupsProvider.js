import React from "react";

const GroupsContext = React.createContext();

function useGroups() {
  const context = React.useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroups must be used within GroupsProvider");
  }
  return context;
}

function GroupsProvider(props) {
  const { groups } = props;
  const value = React.useMemo(() => groups||[], [groups]);
  return <GroupsContext.Provider value={value} {...props} />;
}

export { GroupsProvider, useGroups };