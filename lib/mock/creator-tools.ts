export const creatorToolsNav = [
  { href: "/drops/creator-tools", label: "Analytics" },
  { href: "/drops/creator-tools/controls", label: "Controls" },
  { href: "/drops/creator-tools/nudges", label: "Nudges" },
  { href: "/drops/creator-tools/prd", label: "PRD" },
];

export const analyticsKpis = [
  {
    label: "Pageviews",
    value: "48.2K",
    delta: "+12%",
    detail: "vs last week",
    tone: "positive" as const,
  },
  {
    label: "Engaged readers",
    value: "6.4K",
    delta: "+8%",
    detail: "commented, reacted, or revisited",
    tone: "positive" as const,
  },
  {
    label: "Creator response rate",
    value: "71%",
    delta: "14 open",
    detail: "high-signal threads still waiting",
    tone: "neutral" as const,
  },
  {
    label: "Best posting window",
    value: "Tue-Thu",
    delta: "8-10 AM",
    detail: "peak click-through and replies",
    tone: "neutral" as const,
  },
];

export const pageviewTrend = [
  { day: "Mon", pageviews: 6200, engaged: 710 },
  { day: "Tue", pageviews: 7100, engaged: 860 },
  { day: "Wed", pageviews: 6800, engaged: 820 },
  { day: "Thu", pageviews: 9100, engaged: 1120 },
  { day: "Fri", pageviews: 10800, engaged: 1260 },
  { day: "Sat", pageviews: 9600, engaged: 1010 },
  { day: "Sun", pageviews: 11800, engaged: 1380 },
];

export const topPosts = [
  { title: "How I batch a week of dinners in 90 minutes", views: 8400, engagement: 6.8 },
  { title: "My no-stress grocery reset template", views: 6700, engagement: 5.4 },
  { title: "What I stopped buying to cut our food budget", views: 5200, engagement: 4.9 },
  { title: "The Sunday prep ritual my readers keep saving", views: 4600, engagement: 4.3 },
];

export const trafficSources = [
  { name: "Direct", value: 38, fill: "#111827" },
  { name: "Notifications", value: 29, fill: "#f59e0b" },
  { name: "Search", value: 21, fill: "#10b981" },
  { name: "Email", value: 12, fill: "#3b82f6" },
];

export const themes = [
  { theme: "Meal prep systems", momentum: 34 },
  { theme: "Budget shortcuts", momentum: 22 },
  { theme: "Family routine hacks", momentum: 19 },
  { theme: "Pantry resets", momentum: 14 },
];

export const actionQueue = [
  {
    title: "Reply to three unanswered questions",
    note: "The meal prep thread is still pulling comments and one creator mention is unresolved.",
    href: "/drops/creator-tools/nudges/high-signal-question",
  },
  {
    title: "Schedule a follow-up for Thursday at 8:30 AM",
    note: "Your highest click-through window is still Tuesday through Thursday morning.",
    href: "/drops/creator-tools/controls/scheduler",
  },
  {
    title: "Turn budget shortcuts into the next conversation starter",
    note: "That theme is now the second-fastest-growing engagement cluster this week.",
    href: "/drops/creator-tools/nudges/conversation-starter",
  },
];

export const nudgeQueue = [
  {
    label: "High-signal question",
    detail: "A reader asked for your freezer meal template and the thread crossed 37 replies.",
    href: "/drops/creator-tools/nudges/high-signal-question",
  },
  {
    label: "Lapsed reader opportunity",
    detail: "Three previously active readers engaged again after your last direct reply.",
    href: "/drops/creator-tools/nudges/lapsed-reader",
  },
  {
    label: "Conversation starter",
    detail: "Community activity dipped yesterday. Prompt: 'What meal shortcut saves your week?'",
    href: "/drops/creator-tools/nudges/conversation-starter",
  },
];

export const controlsKpis = [
  { label: "Scheduled posts", value: "12", detail: "6 this week, 6 next week" },
  { label: "Pinned posts", value: "3/3", detail: "all slots currently in use" },
  { label: "Team-authored drafts", value: "7", detail: "awaiting creator review" },
  { label: "Hidden posts", value: "4", detail: "kept private without deletion" },
];

export const scheduledPosts = [
  {
    title: "My 5-ingredient breakfast reset",
    status: "Scheduled",
    publishAt: "Tomorrow • 8:30 AM",
    source: "Creator",
    href: "/drops/creator-tools/controls/scheduler",
  },
  {
    title: "Sunday prep Q&A follow-up",
    status: "Awaiting review",
    publishAt: "Thu • 9:00 AM",
    source: "Team",
    href: "/drops/creator-tools/controls/team-review",
  },
  {
    title: "April pantry challenge kickoff",
    status: "Draft",
    publishAt: "Fri • 10:15 AM",
    source: "Team",
    href: "/drops/creator-tools/controls/scheduler",
  },
];

export const pinnedPosts = [
  {
    title: "Start here: welcome to my meal planning community",
    note: "Evergreen orientation post • pinned for 42 days",
  },
  {
    title: "April batch-cooking AMA",
    note: "Active event thread • 218 comments",
  },
  {
    title: "Free printable grocery reset checklist",
    note: "Top converting resource • 12% CTR to blog",
  },
];

export const moderationActions = [
  {
    title: "Hide duplicate promo thread",
    note: "Flagged by two moderators. Keeps the main discussion clean without deleting history.",
    href: "/drops/creator-tools/controls/moderation",
  },
  {
    title: "Review team-submitted follow-up copy",
    note: "Posted as creator with disclosure enabled. Ready for one-click approval.",
    href: "/drops/creator-tools/controls/team-review",
  },
  {
    title: "Unpin AMA thread on Friday evening",
    note: "Schedule pin removal so the onboarding post regains the top slot after the event.",
    href: "/drops/creator-tools/controls/pins",
  },
];

export const postingCalendar = [
  { day: "Mon", slot: "1 scheduled", emphasis: false },
  { day: "Tue", slot: "2 scheduled", emphasis: true },
  { day: "Wed", slot: "Creator review", emphasis: false },
  { day: "Thu", slot: "1 team draft", emphasis: true },
  { day: "Fri", slot: "Promotional post", emphasis: false },
  { day: "Sat", slot: "Open", emphasis: false },
  { day: "Sun", slot: "AMA recap", emphasis: true },
];

export const nudgeKpis = [
  { label: "Nudges sent today", value: "2", detail: "within the default daily cap" },
  { label: "Action rate", value: "34%", detail: "creators replied or scheduled after opening" },
  { label: "Re-engaged readers", value: "19", detail: "returned within 7 days of creator response" },
  { label: "Digest cadence", value: "Daily", detail: "real-time only for high-signal mentions" },
];

export const nudgeInbox = [
  {
    type: "High-signal question",
    title: "Reader asking for your freezer meal template",
    body: "37 replies and a direct creator mention. Likely worth an immediate response.",
    priority: "Respond now",
    href: "/drops/creator-tools/nudges/high-signal-question",
  },
  {
    type: "Lapsed reader",
    title: "Two previously active readers returned to a recent budget thread",
    body: "A direct reply here has strong odds of pulling them back into weekly participation.",
    priority: "Worth a reply",
    href: "/drops/creator-tools/nudges/lapsed-reader",
  },
  {
    type: "Conversation starter",
    title: "Community activity is below your 7-day average",
    body: "Suggested prompt: 'What pantry shortcut saves you the most money each week?'",
    priority: "Post today",
    href: "/drops/creator-tools/nudges/conversation-starter",
  },
];

export const nudgePreferences = [
  { label: "High-signal questions", value: "Real-time + digest" },
  { label: "Lapsed reader opportunities", value: "Digest only" },
  { label: "Conversation starters", value: "Daily at 7:00 AM" },
  { label: "Quiet hours", value: "9:00 PM - 7:00 AM" },
];

export const experimentStats = [
  { label: "Replies triggered", value: "41", note: "from nudges in the last 30 days" },
  { label: "Posts scheduled", value: "9", note: "after conversation starter prompts" },
  { label: "Readers recovered", value: "15%", note: "returned within 7 days" },
];
