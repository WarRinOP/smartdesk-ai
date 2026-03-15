# SmartDesk — AI Customer Support System

> A trainable AI customer support system. Upload your business documents — SmartDesk answers customer questions using your content, logs every conversation, and flags knowledge gaps.

**Built for the Fiverr portfolio by Abrar Tajwar Khan.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chat Widget** | Floating chat bubble on any page — dark, premium UI |
| 📄 **Document Upload** | Upload PDF or TXT files; auto-chunked and embedded |
| 🔍 **RAG Pipeline** | Retrieves top 4 relevant chunks before answering |
| 📊 **Admin Dashboard** | All conversations, confidence scores, session logs |
| 🗂 **Knowledge Manager** | View, preview, and delete uploaded content |
| 🚨 **Gap Report** | AI-clustered unanswered questions ranked by frequency |
| ⚙️ **Bot Config** | Bot name, persona, welcome & escalation messages |

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 — custom dark theme |
| Database | Supabase (PostgreSQL + pgvector) |
| AI Model | Anthropic Claude claude-sonnet-4-6 |
| Embeddings | Voyage AI `voyage-3-lite` (512 dims) |
| File Parsing | pdf-parse |
| Deployment | Vercel |

---

## 🚀 Setup

### 1. Clone & install

```bash
git clone https://github.com/abrartajwar/smartdesk-ai.git
cd smartdesk-ai
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
# Fill in your keys
```

Required keys:

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `VOYAGE_API_KEY` | [dash.voyageai.com](https://dash.voyageai.com) (free tier) |

### 3. Set up Supabase database

Run migrations in Supabase SQL editor (from `/supabase/migrations/`).

### 4. Start development server

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
app/
├── page.tsx                # Chat widget demo (public)
├── admin/
│   ├── page.tsx            # Conversation dashboard
│   ├── knowledge/page.tsx  # Knowledge base manager
│   ├── gaps/page.tsx       # Knowledge gap report
│   └── config/page.tsx     # Bot configuration
└── api/
    ├── chat/route.ts       # RAG chat endpoint
    ├── upload/route.ts     # Document upload
    ├── conversations/route.ts
    ├── gaps/route.ts
    └── config/route.ts

components/
├── chat/   # ChatWidget, MessageBubble, TypingIndicator
├── admin/  # ConversationTable, StatsCards, GapReport, etc.
└── ui/     # Button, Card, Badge, FileUpload

lib/
├── supabase.ts  # Supabase clients
├── claude.ts    # Anthropic SDK
├── rag.ts       # Chunk, embed, retrieve
└── pdf.ts       # PDF/TXT parsing
```

---

## 🎬 Demo Scenario

1. Upload `restaurant-menu.pdf` via **Knowledge Manager**
2. Customer asks *"Do you have gluten-free pasta?"* in the chat widget
3. Bot retrieves relevant menu chunks and answers correctly
4. **Admin Dashboard** shows the conversation logged with confidence score
5. **Gap Report** flags *"Opening hours — asked 3 times, no answer in docs"*

---

## 📄 License

MIT — free to use for portfolio and commercial projects.
