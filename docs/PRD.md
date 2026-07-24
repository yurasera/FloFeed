# Product Requirements Document (PRD)

# Flofeed MVP

## 1. Product Overview

### Product Name
Flofeed

### Product Vision

Flofeed helps mentors create better learning experiences by collecting honest learner feedback and transforming it into actionable insights using AI.

### Product Summary

Flofeed is an AI-powered anonymous feedback platform designed for programming bootcamps and learning communities.

The product addresses a common problem experienced by mentors: learners often stay silent when they are confused or struggling. As a result, mentors improve their teaching based on assumptions rather than real feedback.

Flofeed creates a safe environment where learners can share honest feedback anonymously and helps mentors understand learning problems through AI-generated insights.

---

# 2. Problem Statement

## Background

Programming bootcamp mentors usually teach classes with 10–30 participants.

After each session:

- Only around 2–5 participants actively provide feedback.
- Most participants remain silent.
- When mentors ask:
  - "Does everyone understand?"
  - "Any questions?"

The common responses are:

- Silence
- "Yes, I understand"

However, many participants may still be confused or struggling.

Mentors often discover these problems later through:
- Assignment results
- Private conversations
- Individual discussions

This creates a situation where mentors must improve their teaching based on assumptions instead of real learner insights.

---

# 3. Target Customer

## Primary Customer

Programming bootcamp mentors.

### Characteristics

- Teach programming classes.
- Handle 10–30 learners per class.
- Need continuous improvement of teaching quality.
- Currently rely on verbal questions or manual feedback forms.

---

# 4. User Personas

## Mentor Persona

### Name
Alex (Example)

### Role
Programming Bootcamp Mentor

### Situation

Alex teaches frontend programming to 25 participants.

After each class:
- Only 3 participants give feedback.
- Most participants say everything is clear.
- Some participants fail assignments because they actually don't understand the concept.

### Pain Points

- Cannot identify learning difficulties early.
- Doesn't know whether teaching speed is appropriate.
- Cannot measure learner understanding.
- Spends time guessing what needs improvement.

### Goal

Understand learner problems quickly and improve teaching quality based on real feedback.

---

## Learner Persona

### Name
Sarah (Example)

### Role
Bootcamp Participant

### Situation

Sarah struggles with a programming concept but hesitates to ask questions.

Reasons:
- Afraid of looking less capable.
- Afraid of slowing down the class.
- Afraid of being judged.

### Pain Points

- Difficult to express confusion openly.
- Does not have a safe channel to provide feedback.

### Goal

Share honest opinions without feeling judged.

---

# 5. MVP Hypothesis

## Core Hypothesis

We believe learners avoid giving honest feedback because they fear being judged.

If we provide an anonymous and simple feedback experience supported by AI analysis,

then learners will provide more honest feedback and mentors will gain actionable insights to improve teaching.

## Success Criteria

The hypothesis is validated when:

- More learners submit feedback compared to traditional methods.
- Feedback contains more specific problems.
- Mentors can identify improvement areas faster.

---

# 6. MVP Goals

## Primary Goal

Validate whether anonymity increases honest learner feedback.

## Secondary Goal

Validate whether AI-generated insights help mentors understand teaching problems faster.

---

# 7. MVP Scope

## Included Features

## 1. Anonymous Feedback Submission

Learners can submit feedback without revealing identity.

Input:

- Learning experience rating
- Understanding level
- Difficulty level
- Written feedback

Example:

"Which part was difficult today?"

"The explanation was too fast."

"I need more examples."

---

## 2. AI Feedback Analysis

AI processes collected feedback.

Output:

### Summary

Example:

"Most learners understand the basic concept but struggle with implementation."

### Common Issues

Example:

- Material pace too fast
- Need more coding examples
- Need additional practice

### Sentiment

Example:

Positive:
70%

Neutral:
20%

Negative:
10%

---

## 3. Mentor Insight Dashboard

Mentor can view:

- Total feedback received
- Learning satisfaction
- Main difficulties
- AI recommendations

Example:

Recommendation:

"Consider adding a practical exercise after explaining React Hooks because many learners mentioned difficulty applying the concept."

---

# 8. User Flow
Learner

Open Feedback Link
|
|
Submit Anonymous Feedback
|
|
AI Processes Feedback
|
|
Mentor Receives Insights

Mentor

Open Dashboard
|
|
Review AI Summary
|
|
Improve Teaching Approach


---

# 9. AI Usage

AI is used to:

## Feedback Classification

Automatically categorize feedback:

Examples:

- Material difficulty
- Teaching speed
- Explanation clarity
- Practice needs

## Sentiment Analysis

Understand learner emotions:

- Positive
- Neutral
- Negative

## Insight Generation

Convert multiple feedback responses into actionable recommendations.

Example:

Input:

"Too fast"
"Need more examples"
"Confused about state management"

AI Output:

"Several learners need slower explanations and more practical examples for state management topics."

---

# 10. Non Goals (Not Included in MVP)

The MVP will not include:

- User authentication
- Payment system
- Complete LMS features
- Course management
- Video learning
- Social community

The focus is only validating feedback collection and AI insight generation.

---

# 11. Success Metrics

## Learner Metrics

- Feedback submission rate
- Average feedback completion time
- Feedback detail quality

## Mentor Metrics

- Time needed to understand class problems
- Number of actionable insights generated
- Mentor satisfaction with insights

---

# 12. Future Development

After MVP validation:

## Phase 2

- QR code feedback access
- Multiple class management
- Feedback history
- Learning progress tracking

## Phase 3

- AI teaching assistant
- Personalized mentor recommendations
- Learning analytics

---

# 13. Current MVP Status

Status:

Prototype / Validation Stage

The MVP focuses on testing the assumption:

"Will learners provide more honest feedback when they feel safe and anonymous?"