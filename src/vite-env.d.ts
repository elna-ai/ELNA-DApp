/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXTERNAL_SERVICE_BASE: string;
  readonly VITE_ELNA_RAG_CANISTER_ID: string;
  readonly VITE_ELNA_IMAGE_CANISTER_ID: string;
  readonly VITE_INTEGRATIONS_BASE: string;
  readonly VITE_TELEGRAM_INTEGRATIONS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
