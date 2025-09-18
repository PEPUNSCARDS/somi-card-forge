import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, DollarSign, CreditCard, User, Zap, Mail, CheckCircle2, Server, Database } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center animate-fade-in">
            <div className="relative">
              <img 
                src={logo} 
                alt="SOMI Card Logo" 
                className="w-32 h-24 object-contain rounded-2xl shadow-primary animate-glow-pulse"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl blur-xl" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 animate-slide-up">
            SOMI Card
          </h1>
          
          <p className="text-xl md:text-2xl text-primary font-semibold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Secure Prepaid Cards with SOMI
          </p>

          {/* Features */}
          <div className="space-y-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create one-time-use prepaid cards funded with SOMI cryptocurrency.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-foreground/80">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary animate-pulse" />
                <span>$20 insurance fee + $100–$5,000 funding</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span>Card details via email in 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary-glow animate-pulse" style={{ animationDelay: '1s' }} />
                <span>One-time use for maximum security</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              variant="gradient" 
              size="xl" 
              onClick={() => navigate('/register')}
              className="sparkle"
            >
              Get Your Card Now
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              onClick={() => navigate('/balance')}
            >
              Check Balance
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Card className="card-premium text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="icon-container mx-auto mb-4 w-fit">
                <DollarSign className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">$100-$5K</h3>
              <p className="text-muted-foreground font-medium">Funding Range</p>
            </Card>
            <Card className="card-premium text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="icon-container mx-auto mb-4 w-fit">
                <Clock className="w-8 h-8 text-accent group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-3xl font-bold text-accent mb-2 group-hover:text-primary transition-colors duration-300">24 Hours</h3>
              <p className="text-muted-foreground font-medium">Delivery Time</p>
            </Card>
            <Card className="card-premium text-center p-8 group hover:scale-105 transition-all duration-300">
              <div className="icon-container mx-auto mb-4 w-fit">
                <Database className="w-8 h-8 text-primary-glow group-hover:text-accent transition-colors duration-300" />
              </div>
              <h3 className="text-3xl font-bold text-primary-glow mb-2 group-hover:text-accent transition-colors duration-300">API</h3>
              <p className="text-muted-foreground font-medium">Backend Integration</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Backend API Integration Section */}
      <section className="relative py-16 px-6 bg-card/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Server className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Automated Backend Processing
            </h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our advanced Backend API automatically processes your transactions once confirmed on the Somnia blockchain, ensuring seamless card generation and delivery.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-premium p-6 text-center">
              <div className="icon-container mx-auto mb-4 w-fit">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-time Processing</h3>
              <p className="text-sm text-muted-foreground">Instant API notifications when transactions are confirmed</p>
            </Card>
            
            <Card className="card-premium p-6 text-center">
              <div className="icon-container mx-auto mb-4 w-fit">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure Integration</h3>
              <p className="text-sm text-muted-foreground">Encrypted API endpoints with authentication</p>
            </Card>
            
            <Card className="card-premium p-6 text-center">
              <div className="icon-container mx-auto mb-4 w-fit">
                <Database className="w-6 h-6 text-primary-glow" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Automated Workflow</h3>
              <p className="text-sm text-muted-foreground">Complete automation from payment to card delivery</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-primary bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Register",
                description: "Enter your name, email and select funding amount",
                icon: User
              },
              {
                step: "02", 
                title: "Pay with SOMI",
                description: "Connect wallet and pay in SOMI cryptocurrency",
                icon: CreditCard
              },
              {
                step: "03",
                title: "Backend Processing",
                description: "Your transaction is processed automatically by our Backend API",
                icon: Server
              },
              {
                step: "04",
                title: "Receive Card",
                description: "Get card details via email within 24 hours",
                icon: Mail
              }
            ].map((item, index) => (
              <Card key={index} className="card-premium text-center p-8 hover:scale-105 transition-all duration-300 group">
                <div className="mb-6 flex justify-center">
                  <div className="icon-large flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                </div>
                <div className="badge-step mb-4">STEP {item.step}</div>
                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;