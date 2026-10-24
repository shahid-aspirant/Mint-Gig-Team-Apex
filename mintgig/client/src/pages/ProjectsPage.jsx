import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import api from '../api/client';
import { Briefcase, Search, Filter, Calendar, Users, IndianRupee } from 'lucide-react';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'Web Development',
    'Design',
    'AI/ML',
    'Mobile Development',
    'Writing',
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let query = `/projects?`;
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (category) query += `category=${encodeURIComponent(category)}&`;

      const res = await api.get(query);
      if (res.success && res.data) {
        setProjects(res.data.projects || []);
      }
    } catch (_) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-brand-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="blue" className="mb-2">Freelance Marketplace</Badge>
          <h1 className="text-3xl font-extrabold text-brand-dark">Freelance Opportunities</h1>
          <p className="text-sm text-brand-muted mt-1 max-w-2xl">
            Real projects posted by clients looking for verified student talent. Use your verified mintGig portfolio to stand out.
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search gigs by keyword or required skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
            <Button type="submit" variant="primary">
              Search Projects
            </Button>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setCategory('')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                category === ''
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-brand-muted border-brand-border hover:bg-gray-50'
              }`}
            >
              All Projects
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  category === cat
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-brand-muted border-brand-border hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand-muted">Loading open projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-brand-border p-12 text-center max-w-lg mx-auto">
            <Briefcase className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-brand-dark">No open projects found</h3>
            <p className="text-xs text-brand-muted mt-1">Try modifying your filters or search keywords.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((proj) => (
              <Card key={proj._id} className="p-6 transition-all hover:border-brand/50" hover>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="emerald">{proj.category}</Badge>
                      <span className="text-xs text-brand-muted">
                        Posted by {proj.client?.name || 'Verified Client'}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-brand-dark hover:text-brand transition-colors">
                      <Link to={`/projects/${proj._id}`}>{proj.title}</Link>
                    </h2>

                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-brand-bg text-brand-text px-2 py-0.5 rounded border border-brand-border font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right side info */}
                  <div className="flex flex-col md:items-end justify-between self-stretch md:min-w-[180px] pt-4 md:pt-0 border-t md:border-t-0 border-brand-border">
                    <div className="md:text-right">
                      <span className="text-base font-extrabold text-brand-dark">
                        ₹{proj.budgetMin?.toLocaleString()} - ₹{proj.budgetMax?.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-brand-muted capitalize">
                        {proj.budgetType} Budget
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 mt-4">
                      <span className="text-xs text-brand-muted">
                        {proj.proposalCount || 0} Proposals
                      </span>
                      <Link to={`/projects/${proj._id}`}>
                        <Button variant="primary" size="sm">
                          View & Apply
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
