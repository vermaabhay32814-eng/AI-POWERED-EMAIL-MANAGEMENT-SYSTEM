# Specification: Intelligent Email Assistant (AI-Powered Email Management System)

## 1. Project Overview & Architecture
The Intelligent Email Assistant is a production-grade full-stack productivity platform designed to streamline inbox workflows using Large Language Models (LLMs) and Google Gmail OAuth integration.

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │  Dashboard / Inbox   │
                    └──────────┬──────────┘
                               │
                         REST API / JWT
                               │
                    ┌──────────▼──────────┐
                    │   Node.js Backend   │
                    │ Express.js + APIs   │
                    └─────┬─────────┬─────┘
                          │         │
             ┌────────────▼─┐   ┌──▼─────────────┐
             │   MongoDB    │   │  Google Gmail  │
             │ Users/Logs   │   │      API       │
             └──────────────┘   └────────────────┘
                          │
                    ┌─────▼──────┐
                    │  AI Service │
                    │ Gemini/OpenAI│
                    └────────────┘
```

---

## 2. Core Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS / Modern CSS Design System, React Router v6, Axios, Lucide React, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose) with fallback in-memory store, JWT Authentication, Bcrypt, Google APIs (`googleapis`), Google Gemini SDK.
- **AI Integrations**: Google Gemini API / OpenAI API for summarization, reply generation, classification, action item extraction, and email simplification.

---

## 3. Key Functional Modules

### A. Authentication & Gmail OAuth
- User registration and login with encrypted passwords (bcrypt) and JWT session tokens.
- Secure Google OAuth 2.0 integration for connecting Gmail accounts without ever storing raw passwords.
- Interactive Simulator / Demo Mode for instant local testing without requiring external credentials.

### B. Intelligent Email Dashboard
- Multi-folder navigation: Inbox, Starred, Sent, Drafts, Trash, and Custom AI Categories.
- Real-time unread/read state toggling, starring, archiving, and deletion.
- Category tagging: Work, Personal, Finance, Shopping, Education, Promotions, Spam, Important.
- Priority detection: High (🔴), Medium (🟡), Low (🟢).

### C. AI Email Intelligence Suite
1. **Executive Summarization**: Distills lengthy email threads into 2-3 concise, actionable bullet points.
2. **Context-Aware Reply Generation**: Crafts tailored email responses with customizable tone (Professional, Friendly, Formal, Concise, Urgent).
3. **Action Items & Deadline Extractor**: Detects tasks, assignments, and due dates directly from email bodies.
4. **"Explain This Email" (ELI5)**: Decodes complex corporate jargon, legal agreements, or technical discussions into clear plain English.
5. **Smart Natural Language Search**: Allows querying inboxes with natural conversational language (e.g., *"Find unpaid invoices from last month"*).
6. **Compose & Polish Assistant**: AI email writer with tone switcher, grammar fix, and length adjustment.

### D. Analytics & Activity Tracking
- Visual dashboard showing email volume, AI processing stats, sentiment breakdown, and action history.
- AI activity logs tracking tokens, generated replies, and summarization events.

---

## 4. API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate user & issue JWT
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/me` - Fetch authenticated user profile

### Gmail OAuth & Account
- `GET /api/gmail/connect` - Generate Google OAuth consent URL
- `GET /api/gmail/callback` - OAuth token exchange callback
- `GET /api/gmail/status` - Check Gmail connection status
- `POST /api/gmail/disconnect` - Revoke & disconnect Gmail account

### Emails
- `GET /api/emails` - Fetch emails with folder, tag, and priority filters
- `GET /api/emails/:id` - Fetch single email details & thread
- `GET /api/emails/search` - Smart search & query
- `PATCH /api/emails/:id/read` - Toggle read/unread
- `PATCH /api/emails/:id/star` - Toggle starred
- `PATCH /api/emails/:id/archive` - Archive email
- `DELETE /api/emails/:id` - Move to trash / delete
- `POST /api/emails/send` - Send an email
- `POST /api/emails/draft` - Save an email draft

### AI Services
- `POST /api/ai/summarize` - Summarize email content
- `POST /api/ai/reply` - Generate contextual reply by tone
- `POST /api/ai/classify` - Classify category and priority
- `POST /api/ai/action-items` - Extract action items & deadlines
- `POST /api/ai/explain` - Explain complex email in simple terms
- `POST /api/ai/rewrite` - Polish / rewrite draft in selected tone
- `POST /api/ai/smart-search` - Convert natural language query into search filter

### Analytics
- `GET /api/analytics/dashboard` - Get inbox stats & AI metrics
- `GET /api/analytics/activity` - Get recent user & AI activity logs

---

## 5. Security & Privacy Guarantees
- No Gmail passwords requested or stored; OAuth 2.0 tokens only.
- Strict token handling: refresh tokens stored securely on server; never sent to frontend.
- Rate limiting and input validation on all AI and auth endpoints.
- CORS restricted to configured frontend origins.
- Sensitive environment variables stored in `.env` and kept in `.gitignore`.
