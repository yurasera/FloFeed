import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const initialState = questions.reduce((acc, q) => {
    acc[q.id] = '';
    return acc;
  }, {});
  const [answers, setAnswers] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    questions.forEach(q => {
      const val = answers[q.id];
      if (q.type === 'rating') {
        if (!val || Number(val) < 1 || Number(val) > 5) {
          newErrors[q.id] = 'Rating must be between 1 and 5.';
        }
      } else if (q.type === 'textarea') {
        if (!val || !val.trim()) {
          newErrors[q.id] = 'This field cannot be empty.';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      navigate('/success');
    }
  };

  return (
    <main className="feedback-page" style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <h1>Feedback Form</h1>
      <form onSubmit={handleSubmit} noValidate>
        {questions.map(q => (
          <div key={q.id} style={{ marginBottom: '1.5rem' }}>
            <label htmlFor={`q-${q.id}`} style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {q.label}
            </label>
            {q.type === 'rating' ? (
              <div role="radiogroup" aria-labelledby={`q-${q.id}`}>
                {[1, 2, 3, 4, 5].map(num => (
                  <label key={num} style={{ marginRight: '0.75rem' }}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={num}
                      checked={answers[q.id] === String(num)}
                      onChange={e => handleChange(q.id, e.target.value)}
                      aria-required="true"
                    />
                    {num}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                id={`q-${q.id}`}
                value={answers[q.id]}
                onChange={e => handleChange(q.id, e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '0.5rem' }}
                aria-required="true"
              />
            )}
            {errors[q.id] && (
              <p style={{ color: 'red', marginTop: '0.25rem' }} role="alert">
                {errors[q.id]}
              </p>
            )}
          </div>
        ))}
        <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#0066ff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Submit Feedback
        </button>
      </form>
    </main>
  );
};

export default FeedbackPage;

