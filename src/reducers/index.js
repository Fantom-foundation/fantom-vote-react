import { combineReducers } from 'redux';
import { ConnectWallet } from './walletconnect.reducers';

const rootReducer = combineReducers({ ConnectWallet });

export default rootReducer;
