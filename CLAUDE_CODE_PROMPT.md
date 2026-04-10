# BRD Push — Claude Code Prompt Template
#
# At the end of any design/prototype session, paste this prompt into Claude Code
# (edit the placeholders or just ask Claude Code to fill them in from context).
# Claude Code will POST the data to the BRD backend and return a ready-to-open URL.
# ─────────────────────────────────────────────────────────────────────────────────

Please push the following requirements to the BRD tool and return a pre-filled link.

Use this script to POST to https://bp-brd.netlify.app/api/session-write:

```javascript
const data = {
  feature:  "<Feature or enhancement name>",
  role:     "<User role, e.g. billing administrator>",
  area:     "<Product area, e.g. Billing Rules, GL, Revenue Rec>",
  need:     "<What the user needs>",
  reason:   "<The business reason / so that...>",
  requirements: [
    "<Requirement 1>",
    "<Requirement 2>",
    "<Requirement 3>"
  ],
  scenarios: [
    {
      given: "<Setup and preconditions>",
      when:  "<Trigger action>",
      then:  "<Expected outcomes>",
      note:  "<Old vs new behavior — optional>"
    }
  ]
};

const res = await fetch('https://bp-brd.netlify.app/api/session-write', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

const result = await res.json();
console.log('Open this link to populate your BRD tool:');
console.log(result.url);
```

Run this script, then give me the URL it returns.

# ─────────────────────────────────────────────────────────────────────────────────
# HOW TO USE
#
# Option A — Fill it yourself:
#   Replace all the <placeholders> with your actual values and paste into Claude Code.
#
# Option B — Let Claude Code fill it:
#   Paste the whole template and say "fill in the placeholders from what we've
#   been building in this session" — Claude Code will extract the right values
#   from your conversation context and run the script automatically.
#
# The script outputs a URL like:
#   https://bp-brd.netlify.app/?session=brd_a3f9x2
#
# Open that URL in your browser → form is pre-populated → enter API key → Generate.
# ─────────────────────────────────────────────────────────────────────────────────
