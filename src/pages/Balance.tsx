import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Wallet, Mail, CheckCircle, ArrowLeft, RefreshCw, Shield, Clock, Server } from "lucide-react";
import { useAccount, useBalance } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import { formatEther } from 'viem';
import { backendAPIService } from '@/lib/backendAPI';

const Balance = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useBalance({
    address: address,
  });
  
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Auto-fill wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
  }, [isConnected, address]);

  const validateAddress = (address: string) => {
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    return walletRegex.test(address);
  };

  const handleRefreshBalance = () => {
    if (isConnected) {
      refetchBalance();
      toast({
        title: "Balance Refreshed",
        description: "Wallet balance updated",
        className: "bg-primary text-primary-foreground"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a wallet address"
      });
      return;
    }
    
    if (!validateAddress(walletAddress)) {
      toast({
        variant: "destructive",
        title: "Invalid Address",
        description: "Please enter a valid wallet address (0x...)"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Send balance request to Backend API
      const success = await backendAPIService.requestBalance(walletAddress);
      
      if (success) {
        setRequestSent(true);
        
        toast({
          title: "Balance Request Sent!",
          description: "Backend API will process your request shortly",
          className: "bg-primary text-primary-foreground"
        });
      } else {
        throw new Error('Backend API request failed');
      }
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: "Failed to connect to Backend API. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRequestSent(false);
    setWalletAddress("");
  };

  if (requestSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        
        <Card className="card-premium max-w-lg w-full text-center animate-scale-in">
          <div className="p-8 space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center animate-fade-in">
              <div className="relative">
                <CheckCircle className="w-20 h-20 text-primary animate-glow-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-4 animate-slide-up">
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Request Sent!
              </h2>
              <p className="text-lg text-foreground">
                Backend API request submitted successfully
              </p>
              <p className="text-muted-foreground">
                You will receive your balance information via email shortly.
              </p>
            </div>

            {/* Request Details */}
            <div className="bg-card/50 border border-border/30 rounded-xl p-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-3">
                <Server className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Backend API Request</span>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet Address:</span>
                  <span className="text-foreground font-mono text-xs">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Status:</span>
                  <span className="text-primary">Processed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Request Time:</span>
                  <span className="text-foreground">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <Button 
                variant="gradient" 
                size="lg" 
                onClick={handleReset}
                className="flex-1"
              >
                Check Another Address
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      
      <Card className="card-premium max-w-md w-full animate-scale-in">
        <div className="p-8">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-primary bg-clip-text text-transparent">
            Check Balance
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wallet Connection */}
            <div className="space-y-4">
              <Label className="text-foreground font-medium">
                <Wallet className="w-4 h-4 inline mr-2" />
                Wallet Connection
              </Label>
              <WalletConnect />
              
              {/* Balance Display */}
              {isConnected && balance && (
                <div className="bg-card/50 border border-border/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current SOMI Balance:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshBalance}
                      disabled={balanceLoading}
                    >
                      <RefreshCw className={`w-4 h-4 ${balanceLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <div className="text-2xl font-bold text-primary mt-1">
                    {formatEther(balance.value)} SOMI
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Address Input */}
            <div className="space-y-2">
              <Label htmlFor="walletAddress" className="text-foreground font-medium">
                Wallet Address *
              </Label>
              <Input
                id="walletAddress"
                type="text"
                placeholder="0x742d35CC6aF5C8dd7F3E5C6D8bD5F7C2a1E5f8e"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="input-premium font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the wallet address used for your SOMI card payment
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={isLoading}
              className="w-full sparkle"
            >
              {isLoading ? (
                <>
                  <Search className="w-5 h-5 animate-spin mr-2" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Request Balance
                </>
              )}
            </Button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Server className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-accent-foreground font-medium mb-1">
                  Backend API Integration
                </p>
                <p className="text-muted-foreground">
                  Your balance request will be processed by our Backend API and sent to your email.
                </p>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <p className="text-xs text-center text-primary-foreground/80">
                Your wallet address is used only for balance verification
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Balance;