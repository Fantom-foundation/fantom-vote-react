import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import './App.css';

import { Web3Utils } from '../src/utils/web3';
import Container from '../src/components/Container';
import { reduxStore } from '../src/stores/reduxStore';

function App() {
  return (
    <ReduxProvider store={reduxStore}>
      <div className="App">
        <Container></Container>
      </div>
    </ReduxProvider>
  );
}

export default App;
