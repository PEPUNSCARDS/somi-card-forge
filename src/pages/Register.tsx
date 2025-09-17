import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Loader2, ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { WalletConnect } from '@/components/WalletConnect';
import { useSomiPrice } from '@/hooks/useSomiPrice';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { sendTransaction, data: hash, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { price: somiPrice, loading: priceLoading } = useSomiPrice();
  
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    fundingAmount: 100
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const insuranceFee = 20;
  const totalUSD = formData.fundingAmount + insuranceFee;
  const somiTotal = somiPrice > 0 ? (totalUSD / somiPrice).toFixed(4) : "0.0000";
  const treasuryAddress = import.meta.env.VITE_TREASURY_ADDRESS || "0x742d35CC6aF5C8dd7F3E5C6D8bD5F7C2a1E5f8e";

  // Watch for transaction success
  useEffect(() => {
    if (isSuccess && hash) {
      // Send notification to Telegram bot
      sendTelegramNotification();
    }
  }, [isSuccess, hash]);

  const sendTelegramNotification = async () => {
    try {
      // Mock telegram notification - replace with actual API
      console.log('Sending Telegram notification:', {
        firstName: formData.firstName,
        email: formData.email,
        amount: formData.fundingAmount,
        transactionHash: hash,
        walletAddress: address
      });
      
      toast({
        title: "Payment Confirmed!",
        description: "Card processing initiated. Redirecting...",
        className: "bg-primary text-primary-foreground"
      });
      
      setTimeout(() => {
        navigate('/confirmation');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
      toast({
        variant: "destructive",
        title: "Notification Failed",
        description: "Payment confirmed but notification failed"
      });
    }
  };

  const handleFundingChange = (increment: boolean) => {
    setFormData(prev => {
      const newAmount = increment 
        ? Math.min(prev.fundingAmount + 50, 5000)
        : Math.max(prev.fundingAmount - 50, 100);
      return { ...prev, fundingAmount: newAmount };
    });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "First name is required"
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Please enter a valid email address"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!isConnected || !address) {
      toast({
        variant: "destructive",
        title: "Wallet Required",
        description: "Please connect your wallet first"
      });
      return;
    }

    if (somiPrice === 0) {
      toast({
        variant: "destructive",
        title: "Price Loading",
        description: "Please wait for SOMI price to load"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Send SOMI to treasury address
      const amountInSomi = parseEther(somiTotal);
      
      sendTransaction({
        to: treasuryAddress as `0x${string}`,
        value: amountInSomi,
      });

      toast({
        title: "Transaction Submitted!",
        description: "Waiting for confirmation...",
        className: "bg-primary text-primary-foreground"
      });
      
    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error?.message || "Please try again or contact support"
      });
      setIsProcessing(false);
    }
  };

  const isLoading = isPending || isConfirming || isProcessing;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      
      <Card className="card-premium max-w-md w-full animate-scale-in">
        <div className="p-8">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-primary bg-clip-text text-transparent">
            Order Your Card
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="input-premium"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input-premium"
                required
              />
            </div>

            {/* Funding Amount Selector */}
            <div className="space-y-4">
              <Label className="text-foreground font-medium">
                Funding Amount
              </Label>
              
              <div className="flex items-center justify-center gap-6 p-6 bg-card/30 rounded-xl border border-border/30">
                <Button
                  type="button"
                  variant="counter"
                  size="counter"
                  onClick={() => handleFundingChange(false)}
                  disabled={formData.fundingAmount <= 100}
                  className="pulse-primary"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                
                <div className="text-center">
                  <div className="counter-glow animate-counter-pop">
                    ${formData.fundingAmount}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    + ${insuranceFee} fee
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="counter"
                  size="counter"
                  onClick={() => handleFundingChange(true)}
                  disabled={formData.fundingAmount >= 5000}
                  className="pulse-primary"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-lg font-semibold text-foreground">
                  Total: ${totalUSD} (~{somiTotal} SOMI)
                </p>
                <p className="text-sm text-muted-foreground">
                  Send to: {treasuryAddress.slice(0, 6)}...{treasuryAddress.slice(-4)}
                </p>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="space-y-4">
              <Label className="text-foreground font-medium">
                <Wallet className="w-4 h-4 inline mr-2" />
                Wallet Connection
              </Label>
              <WalletConnect />
              {isConnected && address && (
                <p className="text-sm text-muted-foreground text-center">
                  Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={isLoading || !isConnected || priceLoading}
              className="w-full sparkle"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {isPending ? "Confirming Transaction..." : 
                   isConfirming ? "Waiting for Confirmation..." : 
                   "Processing Payment..."}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay {somiTotal} SOMI
                </>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <p className="text-sm text-center text-primary-foreground/80">
                Your payment is secured by blockchain technology
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;