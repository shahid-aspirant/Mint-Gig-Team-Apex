import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, TextArea } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8 flex-1 w-full">
        <div className="text-center space-y-2">
          <Badge variant="mint">Support & Inquiries</Badge>
          <h1 className="text-3xl font-extrabold text-brand-dark">Get in Touch</h1>
          <p className="text-xs text-brand-muted max-w-md mx-auto">
            Questions about our learning tracks, certificate verification, or freelance marketplace?
          </p>
        </div>

        <Card className="p-8 bg-white">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h2 className="text-lg font-bold text-brand-dark">Message Received!</h2>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Thank you for contacting mintGig. Our support team will reply within 24 hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Your Name" required placeholder="Aarav Sharma" />
              <Input label="Email Address" type="email" required placeholder="name@example.com" />
              <TextArea
                label="Message or Feedback"
                required
                rows={4}
                placeholder="Let us know how we can assist you..."
              />
              <Button type="submit" variant="primary" size="md">
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
