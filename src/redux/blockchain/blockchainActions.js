// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";

// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        if (networkId === CONFIG.NETWORK.ID) {
          const SmartContractObj = new Web3EthContract(
            abi,
            CONFIG.CONTRACT_ADDRESS
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`));
          try {
            await web3.currentProvider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: Web3.utils.toHex(CONFIG.NETWORK.ID) }],
            });

            const accounts = await ethereum.request({
              method: "eth_requestAccounts",
            });
            const networkId = await ethereum.request({
              method: "net_version",
            });
            if (networkId == CONFIG.NETWORK.ID) {
              const SmartContractObj = new Web3EthContract(
                abi,
                CONFIG.CONTRACT_ADDRESS
              );
              dispatch(
                connectSuccess({
                  account: accounts[0],
                  smartContract: SmartContractObj,
                  web3: web3,
                })
              );
            }
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code == 4902) {
              //alert("add this chain id");
              try {
                await web3.currentProvider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: Web3.utils.toHex(CONFIG.NETWORK.ID),
                      rpcUrls: [CONFIG.NETWORK.RPC_URL],
                      chainName: CONFIG.NETWORK.NAME,
                      nativeCurrency: {
                        name: CONFIG.NETWORK.SYMBOL,
                        decimals: 18,
                        symbol: CONFIG.NETWORK.SYMBOL,
                      },
                      blockExplorerUrls: [CONFIG.SCAN_LINK],
                      iconUrls: [
                        "https://polygonscan.com/images/svg/brands/polygon.svg",
                      ],
                    },
                  ],
                });
                const accounts = await ethereum.request({
                  method: "eth_requestAccounts",
                });
                const networkId = await ethereum.request({
                  method: "net_version",
                });
                if (networkId == CONFIG.NETWORK.ID) {
                  const SmartContractObj = new Web3EthContract(
                    abi,
                    CONFIG.CONTRACT_ADDRESS
                  );
                  dispatch(
                    connectSuccess({
                      account: accounts[0],
                      smartContract: SmartContractObj,
                      web3: web3,
                    })
                  );
                }
              } catch (switchError) {
                dispatch(connectFailed("Something went wrong."));
              }
            }
          }
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
        window.location.replace("dapp://raspy-sea-0071.on.fleek.co/");
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
      window.location.replace("dapp://raspy-sea-0071.on.fleek.co/");
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
