import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <main className="home-page" style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
    {/* Hero Section */}
    <section className="hero" style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h1>Welcome to FloFeed</h1>
      <p>Anonymous feedback platform.</p>
      <Link
        to="/feedback"
        className="cta-button"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#0066ff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
        aria-label="Give feedback"
      >
        Give Feedback
      </Link>
    </section>

    {/* Features Section */}
    <section className="features" style={{ marginBottom: '2rem' }}>
      <h2>Features</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <li style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <strong>Anonymous Feedback</strong>
          <p>All responses are posted without personal data.</p>
        </li>
        <li style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <strong>Easy to Use</strong>
          <p>A simple, clean interface for quick submissions.</p>
        </li>
        <li style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <strong>Honest Insights</strong>
          <p>Get candid opinions to improve yourself.</p>
        </li>
        <li style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <strong>Quick Submission</strong>
          <p>Submit feedback in just a few clicks.</p>
        </li>
      </ul>
    </section>

    {/* How It Works Section */}
    <section className="how-it-works" style={{ marginBottom: '2rem' }}>
      <h2>How It Works</h2>
      <ol style={{ paddingLeft: '1.5rem' }}>
        <li>Open the feedback form.</li>
        <li>Answer the questions honestly.</li>
        <li>Submit and see a success confirmation.</li>
      </ol>
    </section>
  </main>
);

export default HomePage;
