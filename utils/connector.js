import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { PROVIDER, PROVIDER_TEST } from "./constants";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

export const walletLink = new WalletLinkConnector({
  url: PROVIDER,
  appName: "Color Museum",
  supportedChainIds: [1, 3, 4, 5, 42],
});

export const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    1: PROVIDER,
    3: PROVIDER_TEST,
  },
  qrcode: true,
});
