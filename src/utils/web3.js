import { ethers } from 'ethers';

const connectMetamask = async () => {
  await window.ethereum.enable();
  //   handle network change & disconnect here
  window.ethereum.on('chainChanged', _chainId => {
    //   handle chainId change
    console.log('chainid is changed to ', _chainId);
  });
  window.ethereum.on('disconnect', error => {
    //   handle disconnect
    console.log('handler for disconnection', error);
  });
  window.ethereum.on('accountsChanged', accounts => {
    if (accounts.length == 0) {
      // handle when no account is connected
      console.log('disconnected');
    }
  });

  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let chainId = (await provider.getNetwork()).chainId;
  console.log(`chain id is ${chainId}`);
  let signer = provider.getSigner();
  let accounts = await provider.listAccounts();
  let account = accounts[0];
  return account, signer;
};

export const Web3Utils = {
  connectMetamask,
};
