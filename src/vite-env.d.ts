/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Somnia Network Configuration
  readonly VITE_SOMNIA_CHAIN_ID: string
  readonly VITE_SOMNIA_RPC_URL: string
  readonly VITE_TREASURY_ADDRESS: string
  
  // Telegram Bot Configuration
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  readonly VITE_TELEGRAM_CHAT_ID: string
  readonly VITE_TELEGRAM_BOT_WEBHOOK: string
  
  // External APIs
  readonly VITE_COINGECKO_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
