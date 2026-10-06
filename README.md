# InterviewIQ.AI

InterviewIQ.AI is a full-stack mock interview practice app. Choose a role and interview mode, practice with timed AI-generated questions and follow-ups, then review your performance and download a report.

## Features

- Google sign-in with Firebase Authentication
- Role-based technical and HR interview sessions
- Resume upload for tailored interview questions
- Timed voice interview practice
- AI-generated answer evaluation and improvement feedback
- Interview history, analytics, and downloadable PDF reports
- Credit plans and checkout with Razorpay

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express, MongoDB/Mongoose
- AI: OpenRouter
- Authentication: Firebase Google sign-in
- Payments: Razorpay

## Prerequisites

- Node.js and npm
- A MongoDB instance for persistent interview data (the server also has local and in-memory fallbacks)
- Firebase project with Google sign-in enabled
- OpenRouter API key for AI interview generation and evaluation
- Razorpay keys to use paid plans

## Configuration

Create `server/.env`:

```env
PORT=6000
MONGODB_URL=mongodb://127.0.0.1:27017/ai_interview
JWT_SECRET=replace-with-a-long-random-secret
OPENROUTER_API_KEY=your-openrouter-api-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

The Vite development server proxies `/api` to `http://localhost:6000`. In production, the Express server serves the built frontend and API from the same origin.

Create `client/.env` with your Firebase web app configuration and Razorpay public key. `VITE_API_URL` is optional and should only be set when hosting the API on a different origin:

```env
VITE_FIREBASE_APIKEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
# Optional; leave unset when the frontend and API share an origin
# VITE_API_URL=https://your-api.example.com
```

Use your own Firebase project for deployment. Enable Google as a Firebase sign-in provider and add your deployed Render domain to its authorized domains. Payment processing requires valid Razorpay credentials on both the client and server. Never commit `.env` files or server secrets.

## Run Locally

Open two PowerShell terminals from the repository root.

In the first terminal, start the backend:

```powershell
cd server
npm install
npm run dev
```

In the second terminal, start the frontend:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL shown in the client terminal, usually `http://localhost:5173`. The backend listens on `http://localhost:6000` with the configuration above.

## Deploy to Render

Create a new **Blueprint** in Render using this repository. The root [`render.yaml`](./render.yaml) builds the Vite frontend, starts the Express server, serves the frontend and API from one web service, and configures `/health` as the health check.

When prompted, set the required environment values:

- `MONGODB_URL`: a persistent MongoDB connection string (for example, MongoDB Atlas)
- `OPENROUTER_API_KEY`: the API key used for interview generation and evaluation
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: Razorpay credentials if payments are enabled
- `VITE_FIREBASE_*`: your Firebase web app configuration; also set `VITE_RAZORPAY_KEY_ID` for client-side checkout

Render generates `JWT_SECRET` automatically. Configure Firebase Authentication to allow the deployed Render hostname. Do not rely on the in-memory database fallback for production data.

## Useful Commands

Run from `client/`:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

Run from `server/`:

```powershell
npm run dev
```

## Project Layout

```text
client/   React and Vite frontend
server/   Express API, authentication, interview, and payment routes
```