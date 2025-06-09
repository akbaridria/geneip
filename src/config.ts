import { getDefaultConfig } from "@tomo-inc/tomo-evm-kit";
import { storyAeneid } from "wagmi/chains";

const tomoClientId = import.meta.env.VITE_TOMO_CLIENT_ID;
const walletConnectProjectID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const basePublicUrl =
  import.meta.env.VITE_BASE_PUBLIC_URL || "http://localhost:3001";
const baseBlockscoutApiUrl = import.meta.env.VITE_BASE_BLOCKSCOUT_API_URL!;
const baseAeneidApiUrl = import.meta.env.VITE_BASE_AENID_API_URL!;
const baseAeneidApiKey = import.meta.env.VITE_BASE_AENID_API_KEY!;
const IP_ASSET_REGISTRY_ADDRESS = "0x77319B4031e6eF1250907aa00018B8B1c67a244b";

const supportedChainIds: number[] = [storyAeneid.id];

const wagmiConfig = getDefaultConfig({
  clientId: tomoClientId,
  appName: "GeneIP",
  projectId: walletConnectProjectID,
  chains: [storyAeneid],
  ssr: false,
});

export {
  wagmiConfig,
  tomoClientId,
  supportedChainIds,
  baseAeneidApiUrl,
  baseBlockscoutApiUrl,
  basePublicUrl,
  baseAeneidApiKey,
  IP_ASSET_REGISTRY_ADDRESS
};
