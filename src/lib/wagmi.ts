import { createConfig, http } from 'wagmi'
import { Chain } from 'viem'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Define Somnia network
export const somnia: Chain = {
  id: 5031,
  name: 'Somnia',
  nativeCurrency: {
    decimals: 18,
    name: 'SOMI',
    symbol: 'SOMI',
  },
  rpcUrls: {
    default: { 
      http: ['https://api.infra.mainnet.somnia.network/'] 
    },
    public: { 
      http: ['https://api.infra.mainnet.somnia.network/'] 
    },
  },
  blockExplorers: {
    default: { 
      name: 'Somnia Explorer', 
      url: 'https://explorer.somnia.network' 
    },
  },
}

export const config = getDefaultConfig({
  appName: 'SOMI Card',
  projectId: 'somi-card-app',
  chains: [somnia],
  transports: {
    [somnia.id]: http(),
  },
})