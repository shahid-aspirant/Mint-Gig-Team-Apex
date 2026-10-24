import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Sparkles, ShieldCheck, Award, Briefcase, GraduationCap } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10 flex-1">
        <div className="text-center space-y-3">
          <Badge variant="mint">Platform Overview</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">About mintGig</h1>
          <p className="text-sm text-brand-muted max-w-xl mx-auto leading-relaxed">
            Bridging the gap between affordable skill learning and real-world freelance earning for college students.
          </p>
        </div>

        <Card className="p-8 space-y-6 bg-white">
          <h2 className="text-lg font-bold text-brand-dark">The Core Problem</h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            College students often take online courses, receive certificates with no verifiable proof of mastery, struggle to build and maintain attractive portfolio websites, and face steep barriers competing against experienced professionals on traditional freelance marketplaces.
          </p>

          <h2 className="text-lg font-bold text-brand-dark pt-2">The mintGig Solution</h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            mintGig combines learning, skill certification, automated portfolio building, and student-focused freelance opportunities into a single cohesive platform:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
              <GraduationCap className="w-5 h-5 text-brand mb-2" />
              <h3 className="text-xs font-bold text-brand-dark">Affordable Learning</h3>
              <p className="text-[11px] text-brand-muted mt-1 leading-normal">
                Curated tracks with zero fluff, priced transparently in INR so any student can participate.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
              <ShieldCheck className="w-5 h-5 text-brand mb-2" />
              <h3 className="text-xs font-bold text-brand-dark">Tamper-Proof Verification</h3>
              <p className="text-[11px] text-brand-muted mt-1 leading-normal">
                Certificates are issued only after passing rigorous server-evaluated assessments.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
              <Award className="w-5 h-5 text-brand mb-2" />
              <h3 className="text-xs font-bold text-brand-dark">Automatic Portfolios</h3>
              <p className="text-[11px] text-brand-muted mt-1 leading-normal">
                Your portfolio updates automatically from database records whenever you complete a course.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
              <Briefcase className="w-5 h-5 text-brand mb-2" />
              <h3 className="text-xs font-bold text-brand-dark">Direct Gigs</h3>
              <p className="text-[11px] text-brand-muted mt-1 leading-normal">
                Clients discover verified talent and review actual course scores when deciding on proposals.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
