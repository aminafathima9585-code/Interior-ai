'use client';

import Link from 'next/link';
import { useDesignStore } from '@/store/designStore';
import { DesignCard } from '@/components/design/DesignCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { designs } = useDesignStore();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Designs</h1>
            <Link href="/design/chat">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Design
              </Button>
            </Link>
          </div>

          {designs.length === 0 ? (
            <Card className="py-16">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No designs yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Start by creating your first interior design. Chat with our AI
                  assistant to describe your space and preferences.
                </p>
                <Link href="/design/chat">
                  <Button size="lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Designing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {designs.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
