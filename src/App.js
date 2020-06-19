import React, { useEffect, useState } from 'react';
import './App.css';
import List from './components/List';
import withListLoading from './components/withListLoading';
import axios from 'axios';

function App() {
  const ListLoading = withListLoading(List);
  const [appState, setAppState] = useState({
    loading: false,
    repos: null,
  });

  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = 'https://my1138.geotab.com/apiv1/Get?typeName=Group&credentials=%7b%22database%22:%22velladev1%22,%22userName%22:%22dante.vella@gmail.com%22,%22password%22:%22Techlab123!!%22%7d';
    axios.get(apiUrl).then((repos) => {
      const allRepos = repos.data;
      setAppState({ loading: false, repos: allRepos });
    });
  }, [setAppState]);

  return (
    <div className='App'>
      <div className='container'>
        <h1>My Data</h1>
      </div>
      <div className='repo-container'>
        <ListLoading isLoading={appState.loading} repos={appState.repos} />
      </div>
      <footer>
        <div className='footer'>
          Built{' '}
          <span role='img' aria-label='love'>
          </span>{' '}
          by Dante Vella
        </div>
      </footer>
    </div>
  );
}
export default App;
