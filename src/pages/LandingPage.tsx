import Navbar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, Users, Clock1, Shield } from "lucide-react";

function LandingPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Eh,
            <span className="text-primary"> who haven't pay yet ah?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track, split and remind your blur friends to pay back with HowMuchAh?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose HowMuchAh?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track</h3>
              <p className="text-muted-foreground">
                Keep tabs on all shared expenses, big or small.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organize</h3>
              <p className="text-muted-foreground">
                Create groups, add friends, and organize expenses easily.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock1 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Efficient</h3>
              <p className="text-muted-foreground">
                Add new expenses in seconds.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted & Secure</h3>
              <p className="text-muted-foreground">
                Your data stays safe with enterprise-grade encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Splitting?
          </h2>
          <p className="text-xl text-muted-foreground">
            Before your friends forget!
          </p>
          <Link to="/login">
            <Button size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 HowMuchAh? All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default LandingPage