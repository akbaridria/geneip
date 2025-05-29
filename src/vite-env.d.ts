/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOMO_CLIENT_ID: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_BASE_PUBLIC_URL: string;
  readonly VITE_BASE_BLOCKSCOUT_API_URL: string;
  readonly VITE_BASE_AENID_API_URL: string;
  readonly VITE_BASE_AENID_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
