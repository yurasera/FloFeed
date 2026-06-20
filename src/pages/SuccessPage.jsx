import React from 'react';

const SuccessPage = () => {
  return (
    <section className="success-page" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Thank you for your feedback!</h1>
      <p>Your feedback has been successfully submitted.</p>
      <a href="/" className="button" style={{ marginTop: '1rem', display: 'inline-block' }}>
        Back to Home
      </a>
    </section>
  );
};

export default SuccessPage;
