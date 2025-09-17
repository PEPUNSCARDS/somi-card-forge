/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Somnia Network Configuration
  readonly VITE_SOMNIA_CHAIN_ID: string
  readonly VITE_SOMNIA_RPC_URL: string
  readonly VITE_TREASURY_ADDRESS: string
  
  // Backend API Configuration
  readonly VITE_BACKEND_API_KEY: string
  readonly VITE_BACKEND_CHAT_ID: string
  readonly VITE_BACKEND_WEBHOOK_URL: string
  
  // Telegram Bot Webhook
  readonly VITE_TELEGRAM_BOT_WEBHOOK: string
  
  // External APIs
  readonly VITE_COINGECKO_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
