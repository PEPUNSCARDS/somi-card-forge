import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
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
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>$20 insurance fee + $100–$5,000 funding</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span>Card details via email in 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-glow rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Card className="card-premium text-center p-6">
              <h3 className="text-3xl font-bold text-primary mb-2">$100-$5K</h3>
              <p className="text-muted-foreground">Funding Range</p>
            </Card>
            <Card className="card-premium text-center p-6">
              <h3 className="text-3xl font-bold text-accent mb-2">24 Hours</h3>
              <p className="text-muted-foreground">Delivery Time</p>
            </Card>
            <Card className="card-premium text-center p-6">
              <h3 className="text-3xl font-bold text-primary-glow mb-2">100%</h3>
              <p className="text-muted-foreground">Secure</p>
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
                icon: "👤"
              },
              {
                step: "02", 
                title: "Pay with SOMI",
                description: "Connect wallet and pay in SOMI cryptocurrency",
                icon: "💳"
              },
              {
                step: "03",
                title: "Processing",
                description: "Your card is processed and prepared securely",
                icon: "⚡"
              },
              {
                step: "04",
                title: "Receive Card",
                description: "Get card details via email within 24 hours",
                icon: "📧"
              }
            ].map((item, index) => (
              <Card key={index} className="card-premium text-center p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-sm text-primary font-bold mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;