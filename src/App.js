import React, { useEffect, useState } from "react";
import "./App.css";
import List from "./components/List";
import withListLoading from "./components/withListLoading";

function App() {
  const ListLoading = withListLoading(List);

  const [api, setApi] = useState();
  const [appState, setAppState] = useState({
    loading: false,
    groups: null,
  });

  useEffect(() => {
    console.log(window.api);
    if (window.api) {
      setApi(window.api);
    }
  }, [window.api]);

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
    <div className="App">
      <div className="container">
        <h1>My Data</h1>
      </div>
      <div className="repo-container">
        <ListLoading
          isLoading={appState.loading}
          groups={appState.groups}
          api={api}
        />
      </div>
      <footer>
        <div className="footer">
          Built <span role="img" aria-label="love"></span> by Dante Vella
        </div>
      </footer>
    </div>
  );
}
export default App;
