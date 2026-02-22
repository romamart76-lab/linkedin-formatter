// ============================================================
// LinkedIn Post Templates
// ============================================================
const TEMPLATES = [
  {
    name: '🎯 Hook → Story → CTA',
    category: 'engagement',
    template: `[Bold hook that stops the scroll]

Here's what happened:

• Point 1
• Point 2
• Point 3

The lesson?

[Key takeaway in bold]

👉 [Call to action / question for comments]

♻️ Repost if this resonated`
  },
  {
    name: '📊 Listicle (Tips/Lessons)',
    category: 'engagement',
    template: `[Number] things I learned about [topic]:

1. [Tip one]
↳ [Brief explanation]

2. [Tip two]
↳ [Brief explanation]

3. [Tip three]
↳ [Brief explanation]

4. [Tip four]
↳ [Brief explanation]

5. [Tip five]
↳ [Brief explanation]

Which one resonates most? 👇`
  },
  {
    name: '🔥 Hot Take / Unpopular Opinion',
    category: 'engagement',
    template: `Unpopular opinion:

[Your bold statement]

Here's why:

Most people think [common belief].

But the reality is [your perspective].

I've seen this firsthand when [brief example].

The result? [Outcome]

Agree or disagree? Let me know 👇`
  },
  {
    name: '📈 Before → After',
    category: 'story',
    template: `[Time period] ago, I was [before state].

Today, I [after state].

Here's what changed:

❌ I stopped [old habit]
✅ I started [new habit]

❌ I stopped [old habit]
✅ I started [new habit]

❌ I stopped [old habit]
✅ I started [new habit]

The biggest shift? [Key insight]

If you're still [before state], try this 👇`
  },
  {
    name: '💡 Problem → Solution',
    category: 'value',
    template: `Everyone talks about [topic].

Nobody talks about [hidden problem].

Here's the issue:

[Explain the problem in 2-3 lines]

Here's what actually works:

Step 1: [Action]
Step 2: [Action]
Step 3: [Action]

The key? [Core insight]

Save this for later 🔖`
  },
  {
    name: '🤝 Personal Story',
    category: 'story',
    template: `I need to share something.

[Opening line that creates curiosity]

[2-3 sentences of context]

The turning point came when [moment].

What I realized:

• [Insight 1]
• [Insight 2]
• [Insight 3]

This changed everything for me.

Has anyone else experienced this? 💬`
  },
  {
    name: '🏆 Achievement / Milestone',
    category: 'story',
    template: `Excited to share: [achievement] 🎉

But here's what nobody sees:

• [Behind the scenes struggle 1]
• [Behind the scenes struggle 2]
• [Behind the scenes struggle 3]

What made the difference:

[Key factor that led to success]

Thank you to [people/community] for [support].

What's your biggest recent win? Share below 👇`
  },
  {
    name: '📋 How-To / Tutorial',
    category: 'value',
    template: `How to [achieve result] (step by step):

𝐒𝐭𝐞𝐩 𝟏: [Action]
→ [Detail/tip]

𝐒𝐭𝐞𝐩 𝟐: [Action]
→ [Detail/tip]

𝐒𝐭𝐞𝐩 𝟑: [Action]
→ [Detail/tip]

𝐒𝐭𝐞𝐩 𝟒: [Action]
→ [Detail/tip]

Pro tip: [Bonus advice]

Follow for more [topic] content ✅`
  },
  {
    name: '❓ Question / Poll',
    category: 'engagement',
    template: `I asked [number] [professionals/founders/experts] one question:

"[The question]"

The top answers surprised me:

🥇 [Answer 1] — [percentage or count]
🥈 [Answer 2] — [percentage or count]  
🥉 [Answer 3] — [percentage or count]

The most interesting insight? [Takeaway]

What would YOUR answer be? 👇`
  },
  {
    name: '🚀 Product / Launch',
    category: 'value',
    template: `We just launched [product/feature] 🚀

The problem we solved:
[One sentence about the pain point]

What it does:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

Why now?
[Market timing / trigger]

Try it free: [link]

Would love your feedback 🙏`
  },
];

// Export for use in popup.js
if (typeof module !== 'undefined') module.exports = TEMPLATES;
