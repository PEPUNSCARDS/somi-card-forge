import { useEffect, useRef } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { backendAPIService, type BackendNotificationData } from '@/lib/backendAPI';

interface UseTransactionMonitorParams {
  hash?: `0x${string}`;
  customerData?: {
    firstName: string;
    lastName: string;
    email: string;
    fundingAmount: number;
    totalAmount: number;
    somiAmount: string;
    walletAddress: string;
  };
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useTransactionMonitor({
  hash,
  customerData,
  onSuccess,
  onError
}: UseTransactionMonitorParams) {
  const notificationSentRef = useRef(false);
  const { 
    data: receipt, 
    isLoading: isConfirming, 
    isSuccess,
    isError,
    error
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Send notification when transaction is confirmed ON-CHAIN ONLY
  useEffect(() => {
    if (isSuccess && receipt && customerData && !notificationSentRef.current) {
      console.log('🔗 Transaction confirmed on-chain:', receipt.transactionHash);
      console.log('📡 Initiating Backend API notification...');
      
      notificationSentRef.current = true;
      
      const notificationData: Omit<BackendNotificationData, 'status'> = {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        fundingAmount: customerData.fundingAmount,
        totalAmount: customerData.totalAmount,
        somiAmount: customerData.somiAmount,
        transactionHash: receipt.transactionHash,
        walletAddress: customerData.walletAddress,
        timestamp: new Date().toISOString()
      };

      // Send Backend API notification asynchronously ONLY after on-chain confirmation
      backendAPIService.sendTransactionConfirmed(notificationData)
        .then((success) => {
          if (success) {
            console.log('✅ Backend API notification sent for confirmed transaction');
          } else {
            console.warn('⚠️ Failed to send Backend API notification');
          }
        })
        .catch((error) => {
          console.error('❌ Error sending Backend API notification:', error);
        });

      // Call success callback
      onSuccess?.();
    }
  }, [isSuccess, receipt, customerData, onSuccess]);

  // Handle transaction error
  useEffect(() => {
    if (isError && error && customerData && !notificationSentRef.current) {
      notificationSentRef.current = true;
      
      const notificationData = {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        fundingAmount: customerData.fundingAmount,
        totalAmount: customerData.totalAmount,
        somiAmount: customerData.somiAmount,
        walletAddress: customerData.walletAddress,
        timestamp: new Date().toISOString(),
        transactionHash: hash || undefined,
        errorMessage: error.message
      };

      // Send failure notification to Backend API
      backendAPIService.sendTransactionFailed(notificationData)
        .catch((notificationError) => {
          console.error('❌ Error sending failure notification to Backend API:', notificationError);
        });

      // Call error callback
      onError?.(error);
    }
  }, [isError, error, customerData, hash, onError]);

  // Reset notification flag when hash changes
  useEffect(() => {
    notificationSentRef.current = false;
  }, [hash]);

  return {
    receipt,
    isConfirming,
    isSuccess,
    isError,
    error
  };
}