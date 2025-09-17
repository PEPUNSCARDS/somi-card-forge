import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Loader2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    fundingAmount: 100
  });
  
  const [somiPrice, setSomiPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Calculate totals
  const insuranceFee = 20;
  const totalUSD = formData.fundingAmount + insuranceFee;
  const somiTotal = somiPrice > 0 ? (totalUSD / somiPrice).toFixed(2) : "0.00";

  // Fetch SOMI price from CoinGecko
  useEffect(() => {
    const fetchSomiPrice = async () => {
      try {
        // Mock price for demo - replace with actual CoinGecko API
        setSomiPrice(1.25); // $1.25 per SOMI
      } catch (error) {
        console.error("Failed to fetch SOMI price:", error);
        setSomiPrice(1.25); // Fallback price
      }
    };
    
    fetchSomiPrice();
  }, []);

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
    
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Required",
        description: "Please connect your wallet first"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API calls and payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Submitted!",
        description: "Redirecting to confirmation...",
        className: "bg-primary text-primary-foreground"
      });
      
      // Redirect to confirmation
      setTimeout(() => {
        navigate('/confirmation');
      }, 1500);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Please try again or contact support"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      
      <Card className="card-premium max-w-md w-full animate-scale-in">
        <div className="p-8">
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
                  Send to: 0x742d...5f8e
                </p>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="space-y-4">
              <Button
                type="button"
                variant={isConnected ? "premium" : "gradient"}
                size="lg"
                onClick={() => setIsConnected(!isConnected)}
                className="w-full"
              >
                {isConnected ? "Wallet Connected (0x742d...5f8e)" : "Connect Wallet"}
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={isLoading || !isConnected}
              className="w-full sparkle"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                "Pay and Order Card"
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-center text-primary-foreground/80">
              🔒 Your payment is secured by blockchain technology
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;