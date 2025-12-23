"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pen, Heart, Users, Zap } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      router.push("/home");
    }
  }, [router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Pen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MiniBlog</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Share Your Stories,{" "}
            <span className="text-primary">Connect with Others</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MiniBlog is a modern platform where you can write, share, and
            discover amazing stories from people around the world.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                Start Writing <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose MiniBlog?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Pen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Easy Writing
              </h3>
              <p className="text-sm text-muted-foreground">
                Intuitive editor that gets out of your way, so you can focus on
                writing great content.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border text-center space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Engage & Interact
              </h3>
              <p className="text-sm text-muted-foreground">
                Like, comment, and share stories with a vibrant community of
                writers and readers.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Build Community
              </h3>
              <p className="text-sm text-muted-foreground">
                Follow your favorite writers and grow your audience with quality
                content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center bg-card border border-border rounded-lg p-12 space-y-6">
          <Zap className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground">
            Join thousands of writers sharing their stories and ideas every day.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MiniBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
