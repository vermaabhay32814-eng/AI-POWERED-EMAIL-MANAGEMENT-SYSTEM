// Mock In-Memory Data Store for resilient offline/local execution
// Preloaded with realistic business & productivity emails
export const mockStore = {
  users: [
    {
      _id: 'user_demo_123',
      name: 'Abhay Verma',
      email: 'abhay.demo@emailassistant.ai',
      passwordHash: '$2a$10$demohashplaceholderxyz123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    }
  ],
  gmailAccounts: [
    {
      userId: 'user_demo_123',
      googleId: 'google_demo_987654',
      email: 'abhay.verma.dev@gmail.com',
      isConnected: true,
      tokenExpiry: new Date(Date.now() + 86400000).toISOString(),
      lastSyncedAt: new Date().toISOString()
    }
  ],
  emails: [
    {
      _id: 'em_101',
      userId: 'user_demo_123',
      messageId: 'msg_gemini_release_001',
      from: { name: 'Sarah Jenkins', email: 'sarah.jenkins@acmecorp.io' },
      to: [{ name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' }],
      subject: 'Urgent: Q3 AI Architecture Review & Milestone Sign-off',
      snippet: "Hi Abhay, Hope you're having a productive week. We reviewed the AI pipeline architecture document and have 3 urgent action items...",
      body: `Hi Abhay,

Hope you're having a productive week!

We reviewed the AI pipeline architecture document and the latest benchmarks for the Gemini 1.5 Pro integration. Overall, the team is impressed with the sub-800ms latency on email summarization.

However, we need your input on three critical items before our board meeting on Thursday at 2:00 PM EST:
1. Submit the revised security audit compliance report by Tuesday 5:00 PM.
2. Confirm the token quota limits for enterprise tier customers.
3. Schedule a 30-minute sync with the DevOps lead (Marcus) to finalize the Kubernetes autoscaling triggers.

Please review the attached spreadsheet and let me know your availability for a quick walkthrough tomorrow afternoon.

Best regards,
Sarah Jenkins
VP of Engineering | Acme Corp
sarah.jenkins@acmecorp.io`,
      date: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min ago
      isRead: false,
      isStarred: true,
      isArchived: false,
      isTrash: false,
      folder: 'inbox',
      category: 'Work',
      priority: 'High',
      summary: 'Sarah requested feedback on 3 urgent items before Thursday: submit security audit by Tuesday 5 PM, confirm token quotas, and schedule a sync with Marcus on autoscaling.',
      actionItems: [
        { task: 'Submit revised security audit compliance report', deadline: 'Tuesday 5:00 PM' },
        { task: 'Confirm token quota limits for enterprise tier', deadline: 'Thursday before 2:00 PM' },
        { task: 'Schedule 30-min sync with Marcus (DevOps)', deadline: 'Tomorrow afternoon' }
      ]
    },
    {
      _id: 'em_102',
      userId: 'user_demo_123',
      messageId: 'msg_stripe_payout_002',
      from: { name: 'Stripe Billing', email: 'notifications@stripe.com' },
      to: [{ name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' }],
      subject: 'Invoice #INV-2026-889 Paid: $4,850.00 USD received',
      snippet: 'Your payout of $4,850.00 USD has been initiated and is expected in your Chase checking account within 2 business days...',
      body: `Hello Abhay,

Great news! A payment of $4,850.00 USD for Invoice #INV-2026-889 has been successfully processed via Stripe.

Payment Details:
- Customer: Enterprise Cloud Solutions LLC
- Amount: $4,850.00 USD
- Processing Fee: $140.65 USD
- Net Deposit: $4,709.35 USD
- Expected Arrival: August 31, 2026

You can download your PDF tax receipt and view customer metadata directly inside your Stripe Dashboard.

Thank you for building with Stripe!
The Stripe Team`,
      date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      isRead: false,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      folder: 'inbox',
      category: 'Finance',
      priority: 'Medium',
      summary: 'Stripe received $4,850.00 USD from Enterprise Cloud Solutions LLC for Invoice #INV-2026-889. Net deposit of $4,709.35 will arrive by Aug 31, 2026.',
      actionItems: [
        { task: 'Download PDF tax receipt from Stripe dashboard', deadline: 'End of month' }
      ]
    },
    {
      _id: 'em_103',
      userId: 'user_demo_123',
      messageId: 'msg_alex_design_003',
      from: { name: 'Alex Rivera', email: 'alex.r@designcraft.studio' },
      to: [{ name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' }],
      subject: 'New Figma Design System Components & Dark Mode V2 Specs',
      snippet: 'Hey Abhay! Just pushed the updated Figma tokens and glassmorphism styling guidelines for our Email Assistant redesign...',
      body: `Hey Abhay!

Just pushed the updated Figma tokens and glassmorphism styling guidelines for our Email Assistant redesign.

Key updates in V2:
- Sleek slate and emerald accent palette with 8-point grid consistency.
- New micro-animations for the AI Summarize and One-Click Reply buttons.
- Responsive mobile drawer for quick email triaging and swipe-to-archive gestures.

Check out the interactive prototype: https://figma.com/proto/email-assistant-v2

Let me know if you want any adjustments to the typography hierarchy or dark mode contrast levels before we hand off the design assets to front-end engineering.

Cheers,
Alex Rivera
Lead UI/UX Designer`,
      date: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
      isRead: true,
      isStarred: true,
      isArchived: false,
      isTrash: false,
      folder: 'inbox',
      category: 'Work',
      priority: 'Medium',
      summary: 'Alex updated the Figma design tokens with emerald glassmorphism, micro-animations, and mobile responsive drawers. Requested feedback on typography and contrast.',
      actionItems: [
        { task: 'Review Figma interactive prototype V2', deadline: 'This week' }
      ]
    },
    {
      _id: 'em_104',
      userId: 'user_demo_123',
      messageId: 'msg_github_security_004',
      from: { name: 'GitHub Security', email: 'no-reply@github.com' },
      to: [{ name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' }],
      subject: '[GitHub] Dependabot alert: 0 vulnerabilities found in email-assistant-ai',
      snippet: 'All 42 production dependencies in your repository have been scanned. No vulnerabilities detected in your active branch...',
      body: `Hi @abhay-verma,

Dependabot has completed its weekly automated security scan of your repository:
abhay-verma/ai-powered-email-management-system

Summary:
- 0 Critical or High severity vulnerabilities
- 42 dependencies scanned (React 18, Vite, Express, Mongoose, Google APIs)
- All security signatures are up to date.

Keep up the great security standards!
The GitHub Security Team`,
      date: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
      isRead: true,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      folder: 'inbox',
      category: 'Work',
      priority: 'Low',
      summary: 'GitHub Dependabot scanned 42 dependencies and confirmed 0 vulnerabilities in the active repository.',
      actionItems: []
    },
    {
      _id: 'em_105',
      userId: 'user_demo_123',
      messageId: 'msg_aws_credits_005',
      from: { name: 'AWS Startups', email: 'activate@amazon.com' },
      to: [{ name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' }],
      subject: 'Congratulations! Your $25,000 AWS Activate Credit Grant is Approved',
      snippet: 'We are thrilled to welcome you to the AWS Activate Portfolio program. Your promotional credit of $25,000 USD has been applied...',
      body: `Dear Abhay,

Congratulations! Your application for the AWS Activate Founders & Portfolio tier has been approved.

Credit Details:
- Promotional Value: $25,000.00 USD
- Valid for: EC2, Lambda, Bedrock AI, S3, RDS, CloudFront
- Expiration Date: August 29, 2028
- Dedicated Solution Architect Office Hours: Included

To redeem your 1-on-1 technical onboarding session with a Principal AI Specialist, click the link in your AWS Activate console.

Happy building on the cloud,
The Amazon Web Services Startup Team`,
      date: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
      isRead: true,
      isStarred: true,
      isArchived: false,
      isTrash: false,
      folder: 'inbox',
      category: 'Finance',
      priority: 'High',
      summary: 'Approved for $25,000 USD AWS Activate credits valid through 2028 across AI and cloud infrastructure, with dedicated solution architect sessions included.',
      actionItems: [
        { task: 'Schedule 1-on-1 technical onboarding with AWS AI Specialist', deadline: 'Within 30 days' }
      ]
    },
    {
      _id: 'em_106',
      userId: 'user_demo_123',
      messageId: 'msg_stanford_ai_006',
      from: { name: 'Stanford Online AI Symposium', email: 'events@online.stanford.edu' },
      to: [{ name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' }],
      subject: 'Speaker Confirmation: Autonomous AI Agents & Email Automation Masterclass',
      snippet: 'Thank you for accepting our invitation to deliver a keynote on "Architecting Enterprise AI Agents with Contextual Memory"...',
      body: `Dear Abhay,

We are delighted to confirm your session for the Stanford Global AI Engineering Symposium 2026.

Session Details:
- Title: "Architecting Enterprise AI Agents with Contextual Memory & Real-Time Tool Integration"
- Date & Time: September 14, 2026 | 10:00 AM - 11:15 AM PST
- Format: Virtual Keynote + Live Q&A
- Attendees: 4,500+ Registered Engineers & AI Researchers

Important Deadlines:
1. Please upload your presentation slide deck by September 7th.
2. Complete the AV/mic tech dry run with our production coordinator on September 10th.

Warm regards,
Dr. Elena Rostova
Chair of Program Committee | Stanford AI Online`,
      date: new Date(Date.now() - 1000 * 60 * 2100).toISOString(),
      isRead: false,
      isStarred: true,
      isArchived: false,
      isTrash: false,
      folder: 'inbox',
      category: 'Education',
      priority: 'High',
      summary: 'Confirmed as Keynote Speaker for Stanford Global AI Symposium on Sept 14. Must submit slide deck by Sept 7 and complete AV check on Sept 10.',
      actionItems: [
        { task: 'Upload keynote presentation slide deck', deadline: 'September 7, 2026' },
        { task: 'Complete AV dry run with production coordinator', deadline: 'September 10, 2026' }
      ]
    },
    {
      _id: 'em_107',
      userId: 'user_demo_123',
      messageId: 'msg_travel_flight_007',
      from: { name: 'Delta Air Lines', email: 'ticketreceipt@delta.com' },
      to: [{ name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' }],
      subject: 'Flight Confirmation #DL-94281: San Francisco (SFO) to New York (JFK)',
      snippet: 'Your upcoming flight to NYC for the Tech Innovation Summit is confirmed. Seat 3A (First Class). Check-in opens 24h prior...',
      body: `Hello Abhay,

Your flight booking is confirmed!

Booking Reference: DL-94281
Passenger: Abhay Verma
Flight: DL 482 Boeing 767-400
Departure: SFO - Sept 18, 2026 at 08:30 AM
Arrival: JFK - Sept 18, 2026 at 04:55 PM
Seat: 3A (Delta One / First Class)

Add this reservation to Apple Wallet / Google Wallet or manage seat preferences directly in the Delta Fly app.

Safe travels,
Delta Air Lines`,
      date: new Date(Date.now() - 1000 * 60 * 3200).toISOString(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      folder: 'inbox',
      category: 'Personal',
      priority: 'Low',
      summary: 'Flight #DL-94281 confirmed from SFO to JFK on Sept 18, departure at 8:30 AM, Seat 3A.',
      actionItems: [
        { task: 'Check in for Delta flight DL 482', deadline: 'Sept 17 at 8:30 AM (24h prior)' }
      ]
    },
    {
      _id: 'em_108',
      userId: 'user_demo_123',
      messageId: 'msg_promo_coursera_008',
      from: { name: 'Coursera Plus', email: 'promotions@coursera.org' },
      to: [{ name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' }],
      subject: 'Flash Sale: 50% Off Annual Subscription for Machine Learning Specializations',
      snippet: 'Master LLM orchestration, RAG architectures, and transformer fine-tuning with certificates from DeepLearning.AI...',
      body: `Unlock 7,000+ courses, professional certificates, and hands-on labs with 50% off Coursera Plus this weekend only!

Popular for developers:
- DeepLearning.AI Generative AI Engineering
- Google Cloud Professional Machine Learning Engineer
- Stanford Machine Learning Specialization

Offer expires Sunday midnight.`,
      date: new Date(Date.now() - 1000 * 60 * 4500).toISOString(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      isTrash: false,
      folder: 'inbox',
      category: 'Promotions',
      priority: 'Low',
      summary: 'Coursera Plus flash sale: 50% off annual subscription for AI and ML specializations until Sunday midnight.',
      actionItems: []
    }
  ],
  activities: [
    {
      _id: 'act_1',
      userId: 'user_demo_123',
      action: 'SUMMARY_GENERATED',
      emailId: 'em_101',
      metadata: { subject: 'Urgent: Q3 AI Architecture Review & Milestone Sign-off' },
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      _id: 'act_2',
      userId: 'user_demo_123',
      action: 'GMAIL_CONNECTED',
      metadata: { email: 'abhay.verma.dev@gmail.com' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
      _id: 'act_3',
      userId: 'user_demo_123',
      action: 'REPLY_GENERATED',
      emailId: 'em_103',
      metadata: { tone: 'Professional', subject: 'New Figma Design System Components' },
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    }
  ],
  aiHistory: []
};
