import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import api from '../api/client';
import { BookOpen, Search, Filter, Clock, Award, Star } from 'lucide-react';

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const categories = [
    'Web Development',
    'Design',
    'AI/ML',
    'Mobile Development',
    'Data Science',
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let query = `/courses?`;
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (selectedCategory) query += `category=${encodeURIComponent(selectedCategory)}&`;
      if (selectedLevel) query += `level=${encodeURIComponent(selectedLevel)}&`;
      if (selectedPrice === 'free') query += `maxPrice=0&`;
      if (selectedPrice === 'paid') query += `minPrice=1&`;

      const res = await api.get(query);
      if (res.success && res.data) {
        setCourses(res.data.courses || []);
      }
    } catch (_) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, selectedPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-brand-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="mint" className="mb-2">Practical Learning</Badge>
          <h1 className="text-3xl font-extrabold text-brand-dark">Skill Tracks & Courses</h1>
          <p className="text-sm text-brand-muted mt-1 max-w-2xl">
            Learn high-demand technical and design skills. Complete structured lessons, pass verified assessments, and earn certificates.
          </p>

          {/* Search bar & filter pills */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by skill (React, Figma, Python...) or topic"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                selectedCategory === ''
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-brand-muted border-brand-border hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  selectedCategory === cat
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-brand-border p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4 flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </h3>

              {/* Price Filter */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-brand-text block mb-2">Price</label>
                <div className="space-y-1.5 text-xs text-brand-muted">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPrice === 'all'}
                      onChange={() => setSelectedPrice('all')}
                      className="text-brand focus:ring-brand"
                    />
                    <span>All Prices</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPrice === 'free'}
                      onChange={() => setSelectedPrice('free')}
                      className="text-brand focus:ring-brand"
                    />
                    <span>Free Courses</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPrice === 'paid'}
                      onChange={() => setSelectedPrice('paid')}
                      className="text-brand focus:ring-brand"
                    />
                    <span>Paid / Premium (INR)</span>
                  </label>
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <label className="text-xs font-semibold text-brand-text block mb-2">Difficulty</label>
                <div className="space-y-1.5 text-xs text-brand-muted">
                  {['', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <label key={lvl} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === lvl}
                        onChange={() => setSelectedLevel(lvl)}
                        className="text-brand focus:ring-brand"
                      />
                      <span>{lvl === '' ? 'All Levels' : lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-brand-muted">Loading courses catalog...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
                <BookOpen className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-40" />
                <h3 className="text-base font-bold text-brand-dark">No courses found</h3>
                <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
                  Try clearing your search query or adjusting your filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('');
                    setSelectedLevel('');
                    setSelectedPrice('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card key={course._id} className="flex flex-col justify-between" hover>
                    <div>
                      {course.thumbnail && (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-44 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="mint">{course.category}</Badge>
                        <span className="text-xs font-medium text-brand-muted">{course.level}</span>
                      </div>
                      <h3 className="text-base font-bold text-brand-dark mb-1.5 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-brand-muted line-clamp-2 mb-3">
                        {course.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {(course.skillTags || []).slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                      <div>
                        <p className="text-base font-extrabold text-brand-dark">
                          {course.price === 0 ? 'Free' : `₹${course.price}`}
                        </p>
                        <p className="text-[10px] text-brand-muted flex items-center space-x-1">
                          <Clock className="w-3 h-3 inline" />
                          <span>{course.duration} Hours</span>
                        </p>
                      </div>
                      <Link to={`/courses/${course._id}`}>
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoursesPage;
