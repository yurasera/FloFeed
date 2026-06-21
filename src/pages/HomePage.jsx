import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Anonymous',
    description:
      'Feedback is submitted without revealing personal information.',
  },
  {
    title: 'Simple',
    description: 'A focused flow that keeps the experience quick and clear.',
  },
  {
    title: 'Fast',
    description: 'Send thoughtful feedback in just a few minutes.',
  },
];

const steps = [
  'Open the feedback form.',
  'Answer the questions honestly.',
  'Submit your feedback.',
];

const HomePage = () => {
  return (
    <main className="home-page">
      <section className="card home-hero" aria-labelledby="home-title">
        <p className="home-hero__eyebrow">Anonymous feedback, made simple</p>
        <h1 id="home-title">FloFeed</h1>
        <p>
          Collect anonymous feedback to help people grow through honest and
          constructive insights.
        </p>
        <div className="home-hero__actions">
          <Link to="/feedback" className="btn btn-primary">
            Give Feedback
          </Link>
        </div>
      </section>

      <section className="home-section" aria-labelledby="features-title">
        <div className="home-section__header">
          <p className="home-section__eyebrow">Why it works</p>
          <h2 id="features-title">Built around clarity</h2>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <article className="card feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card how-it-works-card" aria-labelledby="how-it-works-title">
        <div className="home-section__header">
          <p className="home-section__eyebrow">The flow</p>
          <h2 id="how-it-works-title">How it works</h2>
        </div>
        <ol className="steps-list">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
};

export default HomePage;
