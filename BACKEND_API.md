# Backend API Configuration Guide

## Overview

The SOMI Card application integrates with a Backend API for automated transaction processing and card generation. All API references have been abstracted to use environment variables for security and flexibility.

## Required Environment Variables

### Core Configuration

```env
# Backend API Configuration
VITE_BACKEND_API_KEY=your_backend_api_key_here
VITE_BACKEND_CHAT_ID=your_backend_chat_id_here
VITE_BACKEND_WEBHOOK_URL=your_backend_webhook_url_here
```

### Variable Descriptions

- **`VITE_BACKEND_API_KEY`**: Authentication key for Backend API requests
- **`VITE_BACKEND_CHAT_ID`**: Unique identifier for the backend chat/channel
- **`VITE_BACKEND_WEBHOOK_URL`**: Complete webhook URL endpoint for Backend API

## API Integration Flow

### 1. Transaction Processing

1. **User Payment**: Customer submits SOMI payment
2. **Blockchain Confirmation**: Wait for on-chain confirmation
3. **Backend Notification**: Send structured payload to Backend API
4. **Automated Processing**: Backend handles card generation

### 2. API Request Format

```typescript
// Headers
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${BACKEND_API_KEY}`,
  'X-Backend-Source': 'somi-card-dapp',
  'X-Chat-ID': BACKEND_CHAT_ID
}

// Payload Structure
{
  \"event_type\": \"card_transaction\",
  \"status\": \"confirmed\",
  \"customer\": {
    \"first_name\": \"John\",
    \"email\": \"john@example.com\"
  },
  \"transaction\": {
    \"funding_amount_usd\": 500,
    \"insurance_fee_usd\": 20,
    \"total_amount_usd\": 520,
    \"somi_amount\": \"416.0000\",
    \"transaction_hash\": \"0x1234...\",
    \"wallet_address\": \"0xabcd...\",
    \"network\": \"Somnia\",
    \"chain_id\": 5031,
    \"timestamp\": \"2024-01-01T12:00:00.000Z\"
  },
  \"metadata\": {
    \"source\": \"somi_card_dapp\",
    \"version\": \"1.0.0\"
  }
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

### From Telegram Integration
- All Telegram-specific code has been abstracted
- Environment variables renamed for clarity
- API calls now use generic webhook format
- No breaking changes to transaction flow

### monitoring unchanged
- Same payload structure maintained
- Error handling preserved