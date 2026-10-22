'use client';

import { useEffect } from 'react';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime application error:', error);
  }, [error]);

  return (
    <Section className="py-32 min-h-[70vh] flex items-center justify-center">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <Badge variant="neutral" className="mb-4">
            System Error
          </Badge>
          <div className="w-14 h-14 rounded-full bg-red-950/40 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={28} />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight mb-4">
            Something went wrong.
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            An unexpected error occurred while processing this request. Our technical operations team has been notified.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => reset()} variant="primary">
              Try Again
            </Button>
            <Button href="/" variant="secondary">
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
