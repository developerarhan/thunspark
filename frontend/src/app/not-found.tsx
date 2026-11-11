import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Badge';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <Section className="py-32 min-h-[70vh] flex items-center justify-center">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <Tag variant="accent" className="mb-4">
            404 Not Found
          </Tag>
          <h1 className="font-display font-medium text-5xl sm:text-6xl text-ink tracking-tight mb-4">
            Page Not Found.
          </h1>
          <p className="text-soft text-sm sm:text-base leading-relaxed mb-8">
            The page you are looking for does not exist or may have been relocated. Return home or reach out to our team.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button href="/" variant="primary">
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Homepage</span>
            </Button>
            <Button href="/contact" variant="secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
