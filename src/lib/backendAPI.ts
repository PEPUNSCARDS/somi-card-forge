/**
 * Backend API Service for SOMI Card
 * 
 * Integrates with Telegram Bot API for transaction notifications:
 * - Transaction notifications (confirmed/failed)
 * - Balance requests
 * - Health checks
 * 
 * Features:
 * - Telegram Bot API integration
 * - Formatted message notifications
 * - Error handling and logging
 * - Environment variable configuration
 * 
 * Environment Variables Required:
 * - VITE_BACKEND_API_KEY: Telegram Bot Token
 * - VITE_BACKEND_CHAT_ID: Telegram Chat/Channel ID
 * - VITE_BACKEND_WEBHOOK_URL: Telegram Bot API Webhook URL
 */

interface BackendNotificationData {
  firstName: string;
  lastName: string;
  email: string;
  fundingAmount: number;
  totalAmount: number;
  somiAmount: string;
  transactionHash: string;
  walletAddress: string;
  timestamp: string;
  status: 'initiated' | 'confirmed' | 'failed';
}

interface BackendAPIConfig {
  apiKey: string;
  chatId: string;
  webhookUrl: string;
}

interface BackendAPIPayload {
  event_type: 'card_transaction' | 'balance_request';
  status?: 'initiated' | 'confirmed' | 'failed';
  customer: {
    first_name?: string;
    last_name?: string;
    email?: string | null;
    wallet_address?: string;
  };
  transaction?: {
    funding_amount_usd: number;
    insurance_fee_usd: number;
    total_amount_usd: number;
    somi_amount: string;
    transaction_hash: string;
    wallet_address: string;
    network: string;
    chain_id: number;
    timestamp: string;
  };
  metadata: {
    source: string;
    version: string;
    timestamp?: string;
  };
}

interface BackendAPIResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class BackendAPIService {
  private config: BackendAPIConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_BACKEND_API_KEY || '',
      chatId: import.meta.env.VITE_BACKEND_CHAT_ID || '',
      webhookUrl: import.meta.env.VITE_BACKEND_WEBHOOK_URL || ''
    };
  }

  private formatPayload(data: BackendNotificationData): BackendAPIPayload {
    return {
      event_type: 'card_transaction',
      status: data.status,
      customer: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email
      },
      transaction: {
        funding_amount_usd: data.fundingAmount,
        insurance_fee_usd: 20,
        total_amount_usd: data.totalAmount,
        somi_amount: data.somiAmount,
        transaction_hash: data.transactionHash,
        wallet_address: data.walletAddress,
        network: 'Somnia',
        chain_id: 5031,
        timestamp: data.timestamp
      },
      metadata: {
        source: 'somi_card_dapp',
        version: '1.0.0'
      }
    };
  }

  async sendNotification(data: BackendNotificationData): Promise<boolean> {
    if (!this.config.apiKey || !this.config.chatId || !this.config.webhookUrl) {
      console.warn('Telegram Bot API configuration missing. Skipping notification.');
      return false;
    }

    try {
      // Format message for Telegram
      const message = this.formatTelegramMessage(data);
      
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('Telegram Bot notification sent successfully', result);
      return true;

    } catch (error) {
      console.error('Failed to send Telegram Bot notification:', error);
      return false;
    }
  }

  private formatTelegramMessage(data: BackendNotificationData): string {
    const statusEmoji = {
      'initiated': '⏳',
      'confirmed': '✅', 
      'failed': '❌'
    };
    
    const emoji = statusEmoji[data.status] || '📋';
    
    return `${emoji} <b>SOMI Card Transaction</b>\n\n` +
           `👤 <b>Customer:</b> ${data.firstName} ${data.lastName}\n` +
           `📧 <b>Email:</b> ${data.email}\n` +
           `💰 <b>Amount:</b> $${data.fundingAmount} + $20 insurance = $${data.totalAmount}\n` +
           `🪙 <b>SOMI:</b> ${data.somiAmount}\n` +
           `🔗 <b>TX:</b> <code>${data.transactionHash}</code>\n` +
           `👛 <b>Wallet:</b> <code>${data.walletAddress}</code>\n` +
           `🌐 <b>Network:</b> Somnia (Chain ID: 5031)\n` +
           `⏰ <b>Time:</b> ${new Date(data.timestamp).toLocaleString()}\n` +
           `📊 <b>Status:</b> ${data.status.toUpperCase()}`;
  }

  async sendTransactionInitiated(data: Omit<BackendNotificationData, 'status'>): Promise<boolean> {
    return this.sendNotification({ ...data, status: 'initiated' });
  }

  async sendTransactionConfirmed(data: Omit<BackendNotificationData, 'status'>): Promise<boolean> {
    return this.sendNotification({ ...data, status: 'confirmed' });
  }

  async sendTransactionFailed(data: Omit<BackendNotificationData, 'status' | 'transactionHash'> & { 
    transactionHash?: string;
    errorMessage?: string;
  }): Promise<boolean> {
    const notificationData: BackendNotificationData = {
      ...data,
      transactionHash: data.transactionHash || 'N/A',
      status: 'failed'
    };
    return this.sendNotification(notificationData);
  }

  // Health check method for Telegram Bot API
  async testConnection(): Promise<boolean> {
    if (!this.config.apiKey) {
      console.warn('Telegram Bot API configuration incomplete');
      return false;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.config.apiKey}/getMe`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Telegram Bot API connection successful:', result.result?.username);
        return true;
      } else {
        console.error('Telegram Bot API connection failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Failed to test Telegram Bot API connection:', error);
      return false;
    }
  }

  // Balance request method for Telegram Bot
  async requestBalance(walletAddress: string, email?: string): Promise<boolean> {
    if (!this.config.apiKey || !this.config.chatId || !this.config.webhookUrl) {
      console.warn('Telegram Bot API configuration missing. Skipping balance request.');
      return false;
    }

    try {
      const message = `🔍 <b>Balance Request</b>\n\n` +
                     `👛 <b>Wallet:</b> <code>${walletAddress}</code>\n` +
                     `📧 <b>Email:</b> ${email || 'Not provided'}\n` +
                     `⏰ <b>Time:</b> ${new Date().toLocaleString()}\n` +
                     `🌐 <b>Network:</b> Somnia (Chain ID: 5031)`;

      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      console.log('Balance request sent to Telegram Bot successfully');
      return true;

    } catch (error) {
      console.error('Failed to send balance request to Telegram Bot:', error);
      return false;
    }
  }
}

// Export singleton instance
export const backendAPIService = new BackendAPIService();

// Export types for use in other files
export type { 
  BackendNotificationData, 
  BackendAPIConfig, 
  BackendAPIPayload, 
  BackendAPIResponse 
};