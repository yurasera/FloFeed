# Flofeed MVP

> **Feedback Engagement Platform for Learning**

Flofeed is an MVP designed to help mentors receive more honest and actionable learner feedback by combining **psychological safety**, **guided reflection**, **accountability**, and **AI-powered insights**.

---

# Overview

Flofeed was born from a common problem experienced in programming bootcamps and learning communities.

After every class, mentors usually ask:

> "Does everyone understand?"

Most learners answer:

> "Yes."

However, many are still confused, hesitate to ask questions, or only share their real struggles privately after class.

As a result, mentors often improve their teaching based on assumptions rather than actual learner experiences.

Flofeed aims to make feedback a natural part of the learning process by making it safe, simple, and meaningful for learners while helping mentors quickly understand the overall learning experience.

---

# Product Vision

> **Build a sustainable feedback culture in learning.**

Rather than creating another feedback form, Flofeed focuses on encouraging learners to consistently reflect on their learning experience and provide feedback that helps mentors improve future sessions.

---

# MVP Hypothesis

We believe learners are more willing to provide honest and useful feedback when:

* they feel psychologically safe,
* they remain accountable through login,
* and they are guided through a simple reflection process.

If learners can submit anonymous feedback while remaining accountable through the system,

then mentors will receive more honest and actionable feedback after every learning session.

---

# Success Metrics

The MVP will be considered successful if it improves both participation and insight quality.

## Feedback Coverage

* More learners submit feedback after every class.

## Useful Feedback

* Mentors receive feedback that helps identify teaching improvements.

## Psychological Safety

* Learners feel comfortable providing honest feedback.

---

# Problem

Programming bootcamp mentors often teach classes with **10–30 learners**, but only a small percentage provide meaningful feedback.

Without learner feedback, mentors don't know:

* whether learners truly understand the material,
* whether the teaching pace is appropriate,
* which concepts remain confusing,
* how learners actually feel during class,
* how to improve future learning sessions.

Most improvements are based on assumptions instead of learner insights.

---

# Research Insights

Interviews revealed that learners do not avoid feedback for only one reason.

Common barriers include:

* fear of being judged,
* not knowing what to write,
* believing everything was already fine,
* treating feedback as a formality,
* not seeing the impact of giving feedback.

These findings suggest that improving feedback participation requires more than anonymity.

Learners also need support to reflect on their learning experience.

---

# Solution

Flofeed combines four core principles.

## Psychological Safety

Learners can provide feedback anonymously.

Mentors never see who submitted each response.

---

## Accountability

Learners log into the system before submitting feedback.

The system knows:

* who has submitted feedback,
* participation history,
* learner progress.

Mentors only see anonymous feedback and aggregated insights.

---

## Reflection

Flofeed guides learners through lightweight reflection before asking for written feedback.

Examples include:

* Mood Check
* Prompt-Based Reflection
* Short Feedback

This reduces the "I don't know what to write" problem.

---

## Engagement

Simple gamification encourages learners to build a consistent feedback habit.

The goal is not faster feedback, but consistent reflection after learning.

---

# MVP Features

## Learner

* Login & Registration
* Anonymous Feedback
* Mood Check
* Prompt-Based Reflection
* Simple Written Feedback
* Feedback Submission Status
* Point History

---

## Mentor

* Session Dashboard
* Anonymous Feedback
* AI Summary
* Common Themes
* Sentiment Analysis
* Teaching Insights
* Improvement Recommendations

---

# Gamification

Gamification is designed to encourage consistency rather than speed.

## Base Points

Feedback submitted within **24 hours**

+10 Points

Feedback submitted after **24 hours**

+5 Points

The 24-hour window encourages learners to reflect while the learning experience is still fresh without forcing them to respond immediately after class.

## Consistency Rewards

* Submit Feedback
  +10 Points

* 7-Day Streak
  +30 Points

* 30 Feedback Submitted
  +100 Points

Points are awarded based on participation rather than feedback length.

Longer feedback does not automatically receive more points because quality is more important than quantity.

---

# User Flow

```text
Landing Page
      ↓
Join Session
      ↓
Login
      ↓
Mood Check
      ↓
Prompt Reflection
      ↓
Anonymous Feedback
      ↓
Submit Feedback
      ↓
Points Earned
      ↓
Mentor Dashboard
```

---

# Technology

Frontend

* React.js

Current MVP

* HTML
* CSS
* JavaScript

AI

* AI-powered feedback summarization
* Sentiment analysis
* Insight generation

---

# Current Status

🚧 MVP Development

Current development focuses on validating one core assumption:

> Learners are more willing to provide honest feedback when psychological safety, guided reflection, and accountability are combined.

The first version intentionally keeps the product small before expanding into a complete learning engagement platform.

---

# Future Roadmap

Future features are intentionally outside the MVP scope.

## Gamification

* XP
* Level System
* Avatar Progression
* Badge
* Achievement
* Reward Collection

---

## Mentor Intelligence

* Advanced AI Summary
* Learning Trend Reports
* Teaching Analytics
* AI Conversation Assistant

---

## Flexible Feedback

### Multi-Card Feedback

Instead of using a single feedback form, mentors can create multiple feedback cards within one session.

Example:

```text
Session Feedback

📚 Learning Material

🎤 Teaching Delivery

🧩 Practice & Project

💬 Suggestions
```

Each card can use different question types:

* Mood Check
* Rating
* Prompt Reflection
* Short Text
* Multiple Choice

This allows mentors to collect more structured insights without overwhelming learners.

---

# Goal

Help mentors improve teaching through honest learner feedback rather than assumptions, while helping learners build a sustainable habit of reflection and feedback throughout their learning journey.
