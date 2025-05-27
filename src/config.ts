import { getDefaultConfig } from "@tomo-inc/tomo-evm-kit";
import { storyAeneid } from "wagmi/chains";

const tomoClientId = import.meta.env.VITE_TOMO_CLIENT_ID;
const walletConnectProjectID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const supportedChainIds: number[] = [storyAeneid.id];

const wagmiConfig = getDefaultConfig({
  clientId: tomoClientId,
  appName: "GeneIP",
  projectId: walletConnectProjectID,
  chains: [storyAeneid],
  ssr: false,
});

export { wagmiConfig, tomoClientId, supportedChainIds };
