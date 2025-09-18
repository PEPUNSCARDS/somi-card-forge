/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Somnia Network Configuration
  readonly VITE_SOMNIA_CHAIN_ID: string
  readonly VITE_SOMNIA_RPC_URL: string
  readonly VITE_TREASURY_ADDRESS: string
  
  // Telegram Bot API Configuration (using abstracted variable names)
  readonly VITE_BACKEND_API_KEY: string      // Telegram Bot Token
  readonly VITE_BACKEND_CHAT_ID: string      // Telegram Chat ID
  readonly VITE_BACKEND_WEBHOOK_URL: string  // Telegram sendMessage URL
  
  // Legacy Telegram Variables (deprecated but kept for compatibility)
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  readonly VITE_TELEGRAM_CHAT_ID: string
  readonly VITE_TELEGRAM_BOT_WEBHOOK: string
  
  // External APIs
  readonly VITE_COINGECKO_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
