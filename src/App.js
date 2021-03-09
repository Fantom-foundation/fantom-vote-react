import React, { useEffect } from 'react'
import logo from './logo.svg'
import { Counter } from './features/counter/Counter'
import './App.css'

import { Web3Utils } from '../src/utils/web3'

function App() {
  useEffect(() => {
    const test = async () => {
      await Web3Utils.connectMetamask()
    }
    test()
  }, [])

  return <div className="App">Fantom Voting App</div>
}

export default App
