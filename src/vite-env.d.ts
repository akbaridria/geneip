/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOMO_CLIENT_ID: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
