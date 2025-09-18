# Telegram Bot API Integration Guide

## Overview

The SOMI Card application integrates with Telegram Bot API for automated transaction processing and card generation notifications. All API references use abstracted environment variable names for security while connecting to Telegram Bot endpoints.

## Required Environment Variables

### Core Configuration

```env
# Telegram Bot API Configuration (using abstracted names)
VITE_BACKEND_API_KEY=your_telegram_bot_token_here
VITE_BACKEND_CHAT_ID=your_telegram_chat_id_here
VITE_BACKEND_WEBHOOK_URL=https://api.telegram.org/bot{BOT_TOKEN}/sendMessage
```

### Variable Descriptions

- **`VITE_BACKEND_API_KEY`**: Telegram Bot Token (get from @BotFather)
- **`VITE_BACKEND_CHAT_ID`**: Telegram Chat/Channel ID where notifications are sent
- **`VITE_BACKEND_WEBHOOK_URL`**: Telegram Bot API sendMessage endpoint URL

## API Integration Flow

### 1. Transaction Processing

1. **User Payment**: Customer submits SOMI payment
2. **Blockchain Confirmation**: Wait for on-chain confirmation
3. **Telegram Notification**: Send formatted message to Telegram Bot
4. **Automated Processing**: Backend handles card generation via Telegram bot

### 2. Telegram Message Format

```typescript
// Headers
{
  'Content-Type': 'application/json'
}

// Telegram Bot API Payload
{
  "chat_id": BACKEND_CHAT_ID,
  "text": "✅ SOMI Card Transaction\n\n👤 Customer: John Doe\n📧 Email: john@example.com\n💰 Amount: $500 + $20 insurance = $520\n🪙 SOMI: 416.0000\n🔗 TX: 0x1234...\n👛 Wallet: 0xabcd...\n🌐 Network: Somnia (Chain ID: 5031)\n⏰ Time: 2024-01-01T12:00:00.000Z\n📊 Status: CONFIRMED",
  "parse_mode": "HTML"
}
```

### 3. Event Types

#### Transaction Events
- **`card_transaction`** with `status: \"confirmed\"`: On-chain transaction confirmed
- **`card_transaction`** with `status: \"failed\"`: Transaction failed

#### Balance Events
- **`balance_request`**: Customer balance inquiry

## Security Features

### 1. Environment Variable Protection
- All sensitive API credentials stored in `.env` files
- No hardcoded URLs or tokens in source code
- Git-ignored environment files

### 2. Authentication
- Bearer token authentication
- Custom headers for source identification
- Chat ID validation

### 3. On-Chain First Policy
- Backend API notifications ONLY after blockchain confirmation
- No speculative or pending transaction notifications
- Verified transaction hashes included

## Backend API Endpoints

### Primary Webhook
```
POST {BACKEND_WEBHOOK_URL}
```
- Receives all transaction and balance events
- Authenticated with API key
- Includes chat ID in headers

### Health Check
```
GET {BACKEND_WEBHOOK_URL}/health
```
- Tests Backend API connectivity
- Returns connection status
- Authenticated endpoint

## Implementation Details

### Service Class
```typescript
class BackendAPIService {
  private config: {
    apiKey: string;      // VITE_BACKEND_API_KEY
    chatId: string;      // VITE_BACKEND_CHAT_ID
    webhookUrl: string;  // VITE_BACKEND_WEBHOOK_URL
  }
}
```

### Key Methods
- `sendTransactionConfirmed()`: On-chain confirmation notification
- `sendTransactionFailed()`: Transaction failure notification
- `requestBalance()`: Balance inquiry request
- `testConnection()`: Health check

## Error Handling

### Configuration Validation
- Missing environment variables logged as warnings
- Graceful degradation when Backend API unavailable
- No application crashes from API failures

### Network Resilience
- Automatic retry logic (if implemented in backend)
- Timeout handling
- Error logging with context

## Development Setup

### 1. Environment Configuration
```bash
# Copy example file
cp .env.example .env

# Edit with your Backend API credentials
vim .env
```

### 2. Backend API Credentials
- Obtain API key from your backend service
- Configure chat ID for notifications
- Set up webhook URL endpoint

### 3. Testing
```bash
# Start development server
npm run dev

# Test Backend API connection in browser console
# Look for \"Backend API connection successful\" logs
```

## Production Deployment

### Environment Variables
- Set all `VITE_BACKEND_*` variables in production environment
- Ensure webhook URL is publicly accessible
- Use secure HTTPS endpoints

### Monitoring
- Monitor Backend API response times
- Log failed notification attempts
- Set up alerts for API connectivity issues

## Troubleshooting

### Common Issues

1. **\"Backend API configuration missing\"**
   - Check `.env` file exists
   - Verify all three Backend API variables are set
   - Restart development server after changes

2. **\"Failed to send Backend API notification\"**
   - Verify webhook URL is accessible
   - Check API key validity
   - Confirm chat ID is correct

3. **\"Backend API connection failed\"**
   - Test webhook URL manually
   - Verify network connectivity
   - Check authentication headers

### Debug Mode
```bash
# Enable verbose logging
console.log('Backend API Config:', {
  hasApiKey: !!import.meta.env.VITE_BACKEND_API_KEY,
  hasChatId: !!import.meta.env.VITE_BACKEND_CHAT_ID,
  hasWebhookUrl: !!import.meta.env.VITE_BACKEND_WEBHOOK_URL
});
```

## Migration Notes

### Complete Backend API Abstraction
- All platform-specific implementations have been removed
- Environment variables use generic Backend API naming
- API calls use standard webhook format with proper authentication
- Structured JSON payloads for all event types
- No breaking changes to transaction flow

### API Request Format
- **Authentication**: Bearer token in Authorization header
- **Source Identification**: X-Backend-Source header
- **Channel ID**: X-Chat-ID header for routing
- **Payload**: Structured JSON with event types and metadata