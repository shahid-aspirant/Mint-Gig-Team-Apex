import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white border-t border-brand-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-brand-dark">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                mint<span className="text-brand-accent">Gig</span>
              </span>
            </Link>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              The student-first learning-to-earning ecosystem. Learn affordable skills, earn verified certificates, showcase your automated portfolio, and land freelance gigs.
            </p>
            <div className="flex items-center space-x-3 text-brand-accent">
              <span className="text-[11px] font-semibold bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                MVP Demo v1.0
              </span>
            </div>
          </div>

          {/* Quick Links: Learn */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-4">
              Learning
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Web+Development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Design" className="hover:text-white transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/courses?price=0" className="hover:text-white transition-colors">
                  Free Skill Tracks
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Freelance & Talent */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-4">
              Opportunities
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Browse Freelance Gigs
                </Link>
              </li>
              <li>
                <Link to="/register?role=client" className="hover:text-white transition-colors">
                  Hire Student Talent
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Verification Process
                </Link>
              </li>
              <li>
                <Link to="/portfolio/aaravsharma" className="hover:text-white transition-colors">
                  Sample Student Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Verification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-4">
              Verification & Trust
            </h4>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-2">
              <div className="flex items-center space-x-2 text-brand-accent">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold text-white">Genuine Course Criteria</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">
                Certificates are issued strictly upon completing lessons and passing server-evaluated assessments with minimum threshold scores.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} mintGig. Built with precision for college hackathon demonstration.</p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <span className="text-gray-500">·</span>
            <span>All demonstration data labeled clearly.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
