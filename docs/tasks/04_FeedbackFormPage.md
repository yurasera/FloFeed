Create anonymous feedback page.

Route:

/feedback

Goal:

Allow learners to submit honest feedback without identity.

Create component:

components/FeedbackForm.tsx


Form fields:

1. Understanding Level

Options:

😊 I understand

😐 I need more explanation

😕 I am confused


2. Learning Experience Rating

Rating:
1-5


3. What was difficult today?

Textarea.


Placeholder:

"Example: React Hooks are still confusing."


4. What should the mentor improve?

Textarea.


Placeholder:

"Example: Need more practical examples."


Show information:

"Your feedback is anonymous. Your identity will not be shared."


Submit button:

"Send Feedback"


After submit:

Show success state:

"Thank you. Your feedback helps improve the learning experience."


No backend.
Store only temporary state.