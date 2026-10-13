# Mini AI Support Inbox

A small support workflow demo built with Next.js, PostgreSQL, and an optional OpenAI-compatible API for AI classification and reply drafting.

Features:
- Enter customer messages
- AI message classification: question, complaint, praise, other
- Draft a response using the configured LLM (or a deterministic fallback when no key is set)
- Store messages and replies in PostgreSQL
- Review message history and update/approve responses

## Stack
- Frontend: Next.js + React
- Backend: Next.js API routes
- Database: PostgreSQL via Prisma ORM
- AI: OpenAI-compatible model (or offline fallback mode)

## Local setup

1. Clone the repo
2. Copy `.env.example` to `.env.local`
3. Start PostgreSQL:

```bash
docker compose up -d db
```

4. Install dependencies:

```bash
npm install
```

5. Push the Prisma schema to the database:

```bash
npm run db:push
```

6. Start the application:

```bash
npm run dev
```

Open http://localhost:3000

## Environment variables

Create `.env.local` from `.env.example` and set values:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/supportinbox?schema=public"
OPENAI_API_KEY="your_key_here"
NEXT_PUBLIC_APP_NAME="Mini AI Support Inbox"
```

If `OPENAI_API_KEY` is empty, the app uses built-in fallback logic so the app still works without an external AI service.

## Database schema

The app stores:
- `Message`: customer details, content, category, status, timestamps
- `Response`: suggested reply, final reply, approval timestamp

## Architecture

- `app/page.tsx`: main dashboard UI
- `components/SupportInbox.tsx`: client-side inbox interactions
- `app/api/messages/route.ts`: create and list messages
- `app/api/messages/[id]/route.ts`: update and approve a message response
- `lib/openai.ts`: AI classification and reply drafting logic
- `lib/prisma.ts`: Prisma connection

## Deployment notes

This repository is ready to be deployed to Vercel or any Node environment with PostgreSQL connectivity. To deploy:

1. Import the repo into Vercel
2. Add the same environment variables above
3. Set the build command to `npm run build`
4. Attach your PostgreSQL database URL as `DATABASE_URL`

## Important note about the live app URL

A public deployment URL is not available from this environment because there are no deploy credentials or hosting configuration connected to the repo here. The app is fully prepared to run locally and is ready for deployment when connected to a hosting provider.

## AI development workflow

This project is designed to show a practical AI-assisted development flow:
- Use Copilot/Cursor/Claude Code for iterative implementation
- Prompt the model for generation, refactor, and test scaffolding
- Keep a human review layer for AI-generated responses
- Validate with an explicit schema and a clear fallback path

## Potential improvements

- Add authentication for support agents
- Add audit logs and approval history
- Add email or CRM integration
- Add a stronger prompt-evaluation loop and model fallback strategy
- Add tests for classification logic and API endpoints
