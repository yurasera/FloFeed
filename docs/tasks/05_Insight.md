Create mock AI insight data.

File:

src/data/mockInsights.ts


Create data representing AI analysis from learner feedback.

Example:

export const aiInsights = {

summary:
"Most learners understand the basic concept but struggle applying it in projects.",


sentiment:
{
positive:70,
neutral:20,
negative:10
},


issues:[
{
topic:"React Hooks",
description:"Learners need more practical examples."
},

{
topic:"Learning Speed",
description:"Some learners feel the explanation pace is too fast."
}
],


recommendation:
"Add more hands-on exercises after explaining concepts."

}


Use TypeScript types.
Prepare the structure so later it can be replaced with OpenAI API.