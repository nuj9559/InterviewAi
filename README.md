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
PORT=8000
MONGODB_URL=mongodb://127.0.0.1:27017/ai_interview
JWT_SECRET=replace-with-a-long-random-secret
OPENROUTER_API_KEY=your-openrouter-api-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

Port `8000` matches the API URL currently configured in the frontend. The backend otherwise defaults to port `6000`.

Create `client/.env` with your Firebase web app configuration and Razorpay public key:

```env
VITE_FIREBASE_APIKEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

The Firebase values have project defaults in the source, but use your own Firebase project for your deployment. Enable Google as a Firebase sign-in provider and add `localhost` to its authorized domains. Payment processing requires valid Razorpay credentials on both the client and server. Never commit `.env` files or server secrets.

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

Open the Vite URL shown in the client terminal, usually `http://localhost:5173`. The backend listens on `http://localhost:8000` with the configuration above.

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