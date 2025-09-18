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

class BackendAPIService {
  private config: BackendAPIConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
      chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
      webhookUrl: import.meta.env.VITE_TELEGRAM_BOT_WEBHOOK || ''
    };
  }

  private formatPayload(data: BackendNotificationData): object {
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
      console.warn('Backend API configuration missing. Skipping notification.');
      return false;
    }

    try {
      const payload = this.formatPayload(data);
      
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: `🔔 SOMI Card Transaction\n\n👤 Customer: ${data.firstName} ${data.lastName}\n📧 Email: ${data.email}\n💰 Amount: $${data.fundingAmount} + $20 insurance = $${data.totalAmount}\n🪙 SOMI: ${data.somiAmount}\n🔗 TX: ${data.transactionHash}\n👛 Wallet: ${data.walletAddress}\n⏰ Time: ${data.timestamp}\n📊 Status: ${data.status}`
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('Backend API notification sent successfully', result);
      return true;

    } catch (error) {
      console.error('Failed to send Backend API notification:', error);
      return false;
    }
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

  // Health check method
  async testConnection(): Promise<boolean> {
    if (!this.config.apiKey || !this.config.webhookUrl) {
      console.warn('Backend API configuration incomplete');
      return false;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.config.apiKey}/getMe`);
      
      if (response.ok) {
        console.log('Backend API connection successful');
        return true;
      } else {
        console.error('Backend API connection failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Failed to test Backend API connection:', error);
      return false;
    }
  }

  // Balance request method
  async requestBalance(walletAddress: string, email?: string): Promise<boolean> {
    if (!this.config.apiKey || !this.config.chatId || !this.config.webhookUrl) {
      console.warn('Backend API configuration missing. Skipping balance request.');
      return false;
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: `🔍 Balance Request\n\n👛 Wallet: ${walletAddress}\n📧 Email: ${email || 'Not provided'}\n⏰ Time: ${new Date().toISOString()}`
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      console.log('Balance request sent to Backend API successfully');
      return true;

    } catch (error) {
      console.error('Failed to send balance request to Backend API:', error);
      return false;
    }
  }
}

// Export singleton instance
export const backendAPIService = new BackendAPIService();

// Export types for use in other files
export type { BackendNotificationData };