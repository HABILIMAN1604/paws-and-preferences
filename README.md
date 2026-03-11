# Paws & Preferences
A premium cat discovery experience built for **Netizen Experience**.

## live demo
Check it out here: https://habiliman1604.github.io/paws-and-preferences/

## Key Features
* **Physics-Based Gestures:** Custom-built swipe interactions using **Framer Motion** for a high-end, native app feel.
* **Bento Grid Summary:** A modern, staggered layout to showcase the user's "Liked" cats in a visually engaging gallery.
* **Smart Rewind (Undo):** A critical feature for error prevention, allowing users to recover from accidental skips.
* **Dopamine-Driven Feedback:** Visual stamps (LIKE/NOPE) and haptic vibration feedback for immediate action reinforcement.
* **Onboarding tutorial:** Complete layover tutorial on how to use the simple page.

## UX decisions
1.  **Haptic & Visual Feedback:** Swiping isn't just an animation; it’s a decision. The color-coded stamps and subtle vibration create a satisfying reward loop for the user.
2.  **Perceived Performance:** By using a `LoadingSkeleton` and pre-caching the top 4 cards, the app feels instantaneous even on slower mobile networks.
3.  **Thumb-Zone Optimization:** All interactive elements (Swipe cards, Rewind button) are placed within the natural reach of a user's thumb for comfortable one-handed mobile use.


## Tech Stack
* **React + Vite + TypeScript:** For a type-safe, high-performance foundation.
* **Tailwind CSS:** For rapid, consistent UI development.
* **Framer Motion:** For gesture-based animations.
