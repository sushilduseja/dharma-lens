# Divya Drishti (Divine Vision)

Divya Drishti is a Next.js application designed to offer personalized spiritual insight and guidance. By describing your current situation or challenge, the app helps you find clarity through timeless wisdom, drawing from Hindu mythological archetypes and dharmic principles.

## Core Features

*   **Situation Canvas:** An intuitive interface for users to describe their personal situations or select from common themes.
*   **Intelligent Pattern Matching:**
    *   Matches user input against a curated set of archetypal patterns from Hindu scriptures.
    *   Utilizes AI (powered by Genkit) to generate dynamic, empathetic guidance if no predefined pattern fits the user's unique context.
*   **Guidance Revelation:** Displays:
    *   Personalized insights connecting ancient wisdom to modern life.
    *   Actionable dharmic guidance steps.
    *   Relevant Sanskrit shlokas (verses) with translations in English and Hindi.
*   **Adaptive & Empathetic:** Designed to understand nuanced inputs and provide thoughtful responses, especially for emotionally complex situations.

## Purpose

In a world full of complexities, Divya Drishti aims to be a digital companion, offering a moment of reflection and direction. It leverages technology to make ancient spiritual teachings accessible and relevant, helping users navigate life's challenges with greater awareness and purpose.

## Tech Stack

*   **Frontend:** Next.js, React, ShadCN UI Components, Tailwind CSS
*   **AI/Backend Logic:** Genkit (for AI-powered flows and LLM integration)

## Getting Started

This project is set up to run in Firebase Studio.

To run locally:

1.  Ensure you have Node.js and npm/yarn installed.
2.  Set up any necessary environment variables (e.g., for Genkit AI providers) in a `.env` file.
3.  Install dependencies: `npm install` or `yarn install`
4.  Run the development server: `npm run dev`
    *   This typically starts Next.js on `http://localhost:9002`.
5.  To run Genkit flows for development (if needed separately): `npm run genkit:dev`

Look at `src/app/page.tsx` to see the main application page.
