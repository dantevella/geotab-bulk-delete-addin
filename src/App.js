import React, { useEffect, useState } from "react";
import "./App.css";
import List from "./components/List";
import { ApiProvider } from "./components/ApiProvider";
import { GroupsProvider } from "./components/GroupsProvider";
import { IsLoadingProvider } from "./components/IsLoadingProvider";
import { SetAppStateProvider } from "./components/SetAppStateProvider"
import DeletionList from "./components/DeletionList";
import { useDeletedGroups, DeletedGroupsProvider } from "./components/DeletedGroupsProvider";

function App() {
  const [api, setApi] = useState();
  const [appState, setAppState] = useState({
    loading: false,
    groups: null,
  });
  const [deleteGroupId, setDeleteGroupId] = useState();

  useEffect(() => {
    console.log(window.api);
    if (window.api) {
      setApi(window.api);
    }
  }, []);

  useEffect(() => {
    if (api) {
      setAppState({ loading: true, groups: null });
      api
        .call("Get", { typeName: "Group", resultsLimit: 100 })
        .then((result) => {
          // Result is the information returned by the server. In this case, it's the 100 devices.
          setAppState({ loading: false, groups: result });
        })
        .catch((error) => {
          // some form of error occured with the request
          console.log(error);
        });
    }
  }, [api]);



  if (!api) return null;
  return (
    <ApiProvider api={api} setApi={setApi}>
      <GroupsProvider groups={appState.groups}>
        <IsLoadingProvider isLoading={appState.loading}>
          <SetAppStateProvider setAppState={setAppState}>
            <DeletedGroupsProvider deletedGroups={deleteGroupId} setDeletedGroups={setDeleteGroupId}>
            <div className="App">
              <div className="container">
                <h1>My Data</h1>
              </div>

              <div className="repo-container">
                {deleteGroupId
                ? <DeletionList/>
                : <List />}
              </div>
              <footer>
                <div className="footer">
                  Built <span role="img" aria-label="love"></span> by Dante
                  Vella
                </div>
              </footer>
            </div>
            </DeletedGroupsProvider>
          </SetAppStateProvider>
        </IsLoadingProvider>
      </GroupsProvider>
    </ApiProvider>
  );
}
export default App;
