# Product Requirements Document (PRD)

# Flofeed MVP

---

# 1. Product Overview

## Product Name

Flofeed

## Product Positioning

**Flofeed is a Feedback Engagement Platform for Learning.**

Unlike traditional feedback forms that only collect responses, Flofeed is designed to build a sustainable feedback culture by combining:

* Psychological Safety
* Accountability
* Reflection
* Engagement

AI acts as a supporting tool that helps mentors understand learner feedback efficiently, rather than being the core value of the product.

---

## Product Vision

**Build a sustainable feedback culture in learning.**

Flofeed helps learners consistently reflect on their learning experience while helping mentors improve teaching through honest, actionable, and AI-assisted learner feedback.

---

## Product Summary

Flofeed is a Feedback Engagement Platform for Learning designed for programming bootcamps and learning communities.

Rather than being only an anonymous feedback tool, Flofeed combines four core principles:

* Psychological Safety
* Accountability
* Reflection
* Engagement

Learners can safely provide anonymous feedback while remaining accountable through login. Guided reflection helps learners express what they experienced during learning, while AI transforms collected feedback into actionable insights for mentors.

The goal is not only to collect more feedback, but also to build a sustainable habit of reflection and continuous improvement throughout the learning process.

---

# 2. Problem Statement

## Background

Programming bootcamp mentors usually teach classes with **10–30 learners**.

After each session:

* Only around **2–5 learners** actively provide feedback.
* Most learners remain silent.
* When mentors ask:

  * "Does everyone understand?"
  * "Any questions?"

The common responses are:

* Silence
* "Yes, I understand."

However, many learners may still be confused or struggling.

Mentors often discover these problems later through:

* Assignment results
* Private conversations
* Individual discussions

This creates a situation where mentors improve their teaching based on assumptions instead of learner insights.

Research interviews also revealed that silence is not caused only by fear.

Common reasons include:

* Learners are afraid of being judged.
* Learners do not know what to write.
* They believe everything is already fine.
* Feedback feels like a formality.
* They do not see the impact of giving feedback.

These findings indicate that increasing feedback participation requires more than anonymity. Learners also need guidance to reflect on their learning experience.

---

# 3. Target Customer

## Primary Customer

Programming bootcamp mentors.

### Characteristics

* Teach programming classes.
* Handle 10–30 learners per class.
* Continuously improve teaching quality.
* Currently rely on verbal questions or traditional feedback forms.

---

# 4. User Personas

## Mentor Persona

### Name

Alex (Example)

### Role

Programming Bootcamp Mentor

### Situation

Alex teaches frontend programming to 25 learners.

After every class:

* Only a few learners submit feedback.
* Most learners say everything is clear.
* Several learners later fail assignments because they actually do not understand the material.

### Pain Points

* Cannot identify learning difficulties early.
* Does not know whether the teaching pace is appropriate.
* Cannot measure learner understanding.
* Spends time guessing what needs improvement.

### Goals

* Understand learner problems quickly.
* Improve teaching based on real learner insights.

---

## Learner Persona

### Name

Sarah (Example)

### Role

Programming Bootcamp Participant

### Situation

Sarah struggles with a programming concept but hesitates to ask questions.

### Pain Points

* Afraid of being judged.
* Afraid of slowing down the class.
* Doesn't know what kind of feedback to write.
* Feels feedback has little impact.
* Often submits generic feedback because there is no guidance.

### Goals

* Reflect on learning easily.
* Give honest feedback without fear.
* Know that feedback contributes to improving future classes.

---

# 5. Research Insights

Interview findings revealed four major themes.

## Psychological Safety

Learners feel safer providing feedback when:

* Their identity is anonymous.
* The learning environment feels safe.
* They trust that mentors will not react negatively.

## Reflection Barrier

Many learners remain silent because:

* They do not know what to write.
* They cannot identify what was difficult.
* They feel everything was already fine.

## Accountability

Feedback participation should become part of the learning process while maintaining learner anonymity toward mentors.

## Engagement

Learners need motivation to consistently reflect after every learning session instead of submitting feedback only occasionally.

---

# 6. MVP Hypothesis

## Core Hypothesis

We believe learners are more willing to provide honest and useful feedback when:

* they feel psychologically safe,
* they remain accountable through login,
* and they are guided through a simple reflection process.

If learners can submit anonymous feedback while remaining accountable through the system,

then mentors will receive more honest and actionable feedback after every learning session.

---

# 7. MVP Goals

## Primary Goal

Validate whether combining:

* Psychological Safety
* Accountability
* Guided Reflection

increases learner feedback participation.

## Secondary Goal

Validate whether AI-generated insights help mentors identify teaching improvements faster.

---

# 8. Core Product Principles

## Psychological Safety

Learners can provide anonymous feedback.

Mentors never know who submitted each response.

---

## Accountability

Learners log into Flofeed.

The system knows:

* who submitted feedback,
* learner participation,
* feedback history.

Mentors only see anonymous responses and aggregated insights.

---

## Reflection

Learners are guided through lightweight reflection before writing feedback.

Examples:

* Mood Check
* Prompt-Based Reflection
* Written Feedback

This reduces the "I don't know what to write" problem.

---

## Engagement

Gamification encourages learners to consistently participate in feedback after every learning session.

The objective is to build a habit of reflection rather than encourage faster submissions.

---

# 9. MVP Scope

## Learner Features

* Login & Registration
* Join Feedback Session
* Anonymous Feedback
* Mood Check
* Prompt-Based Reflection
* Simple Written Feedback
* Feedback Submission Status
* Point History

---

## Mentor Features

* Feedback Dashboard
* Anonymous Responses
* AI Summary
* Common Themes
* Sentiment Analysis
* Teaching Recommendations

---

# 10. Gamification

Gamification encourages consistency rather than speed.

## Base Points

Submit feedback within **24 hours**

+10 Points

Submit feedback after **24 hours**

+5 Points

The 24-hour window encourages learners to reflect while the learning experience is still fresh without forcing immediate responses.

---

## Consistency Rewards

Submit Feedback

+10 Points

7-Day Feedback Streak

+30 Points

30 Feedback Submitted

+100 Points

---

## Reflection Activities

Mood Check

+5 Points

Prompt Reflection

+10 Points

Complete Feedback

+15 Points

Points are awarded based on participation rather than feedback length.

Longer responses do not automatically receive more points.

---

# 11. User Flow

## Learner

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

---

## Mentor

Open Dashboard

↓

View Session Summary

↓

Review AI Insights

↓

Improve Teaching

---

# 12. AI Usage

AI supports mentor decision-making rather than replacing it.

AI is responsible for:

## Feedback Classification

Automatically categorizing learner feedback.

Examples:

* Material Difficulty
* Teaching Speed
* Explanation Clarity
* Practice Needs

---

## Sentiment Analysis

Identify overall learner sentiment.

* Positive
* Neutral
* Negative

---

## Theme Detection

Identify repeated issues across multiple learners.

---

## Insight Generation

Generate concise teaching recommendations.

Example

Input:

* Too fast
* Need more examples
* Confused about React Hooks

Output:

> Several learners struggled with React Hooks implementation. Consider slowing the explanation and adding more hands-on exercises.

---

# 13. Non Goals (Out of MVP Scope)

The MVP will **not** include:

* Avatar Progression
* XP & Level System
* Badge & Achievement
* Multi-Card Feedback
* Advanced Learning Analytics
* AI Mentor Assistant
* Payment System
* LMS Features
* Course Management
* Video Learning
* Social Community

The MVP focuses on validating learner feedback participation and mentor insight generation.

---

# 14. Success Metrics

## Feedback Coverage

Percentage of learners submitting feedback.

---

## Useful Feedback

Percentage of feedback that helps mentors identify actionable improvements.

---

## Reflection Completion

Percentage of learners completing the full reflection flow.

---

## Psychological Safety

Learners report feeling comfortable providing honest feedback.

---

## Mentor Value

Mentors report that AI insights help improve teaching decisions.

---

# 15. Future Development

## Gamification

* XP
* Level
* Avatar Progression
* Badge
* Achievement
* Reward Collection

---

## Mentor Intelligence

* Advanced AI Summary
* Learning Trend Analysis
* Teaching Analytics
* AI Mentor Assistant

---

## Flexible Feedback

### Multi-Card Feedback

A single feedback session can contain multiple Feedback Cards.

Example:

* Learning Material
* Teaching Delivery
* Practice & Project
* Suggestions

Each card may use different question types:

* Mood Check
* Rating
* Prompt-Based Reflection
* Short Text
* Multiple Choice

This allows mentors to collect more structured insights while keeping each reflection focused.

---

# 16. Current MVP Status

**Status:** Validation Stage

The MVP validates the following assumption:

> Learners are more willing to provide honest and useful feedback when psychological safety, accountability, and guided reflection are combined.

The long-term vision is to transform feedback from a one-time activity into a sustainable learning habit that continuously improves both learners and mentors.
