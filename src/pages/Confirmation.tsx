import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, Mail, ArrowLeft, CreditCard, Server, Zap, Shield } from "lucide-react";

const Confirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Show success toast on component mount
    toast({
      title: "Payment Confirmed!",
      description: "Processing initiated.",
      className: "bg-primary text-primary-foreground border-primary/20"
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <Card className="card-premium max-w-lg w-full text-center animate-scale-in">
        <div className="p-8 space-y-6">
          {/* Header with navigation */}
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
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          {/* Success Icon */}
          <div className="flex justify-center animate-fade-in">
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
            Payment Submitted
          </h2>

          {/* Success Message */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg text-foreground">
              Your transaction is confirmed on-chain!
            </p>
            <p className="text-muted-foreground">
              Your card is being processed. You'll receive details via email within 24 hours.
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-card/50 border border-border/30 rounded-xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-semibold text-foreground mb-4">Processing Status</h3>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">Transaction confirmed on Somnia blockchain</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-accent flex-shrink-0 animate-pulse" />
                <span className="text-sm text-accent">Processing card generation</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                <span className="text-sm text-muted-foreground/50">Automated processing (up to 24 hours)</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                <span className="text-sm text-muted-foreground/50">Email delivery with card details</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h4 className="font-medium text-primary mb-2">Order Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Funding Amount:</span>
                <span className="text-foreground">$100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insurance Fee:</span>
                <span className="text-foreground">$20</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-border/20 pt-2 mt-2">
                <span>Total Paid:</span>
                <span className="text-primary">$120 (~96.00 SOMI)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 animate-scale-in" style={{ animationDelay: '0.8s' }}>
            <Button 
              variant="gradient" 
              size="lg" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Back to Home
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/balance')}
              className="flex-1"
            >
              Check Balance
            </Button>
          </div>

          {/* Support Note */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <p className="text-sm text-center text-foreground">
                Your payment is secured by blockchain technology. Need help? Contact support or check your balance anytime.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Confirmation;