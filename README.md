# Bonus Game

A full-stack weighted bonus wheel game built with **TypeScript**, **PixiJS**, and **Express**. This project was developed as a coding assessment to demonstrate clean architecture, game loop logic, and secure backend RNG.

## 🛠️ Tech Stack

* **Frontend:** PixiJS (v8), TypeScript, Vite, GSAP (Animations), Howler.js (Sound)
* **Backend:** Node.js, Express, TypeScript
* **Tools:** Git, npm

## 📋 Prerequisites

* Node.js (v18 or higher recommended)
* npm (comes with Node.js)

## 🚀 Installation & Setup

This project uses a mono-repo structure. You need to open **two separate terminal windows** to run the backend and frontend simultaneously.

### Terminal 1: Backend
```bash
git clone <your-repo-url>
cd spinplay-wheel-game
cd server
npm install

# Start the server (Runs on port 3000)
npm run dev

```

### Terminal 2: Frontend

```bash
# Open a NEW terminal window in the project root
cd client
npm install

# Start the game client
npm run dev

```

## 🎮 How to Play

* **Start:** Click **"PLAY"** on the Title Screen.
* **Spin:** Click the **Center Cap** of the wheel (marked "SPIN") to start the game.
* **Win:** The wheel will spin and land on a prize based on server-side weighted logic.
* **Celebration:** Enjoy the particle effects and credit rollup animation!
* **Loop:** The game will automatically return to the Title Screen after the celebration.

## 🐞 Debugging & Testing

The game includes a **Debug Panel** to verify that specific outcomes trigger correctly (as per requirement).

1. Look for the **Debug Panel** in the top-right corner of the Bonus Screen.
2. Click any number **(0-7)**.
3. The **"Enable Force"** checkbox will turn **Green**, indicating the next spin is rigged.
4. Click **SPIN**. The wheel is guaranteed to land on your selected index.
5. Check the Server Terminal logs to confirm: `[DEBUG] Forcing stop at index: X`

## 📂 Project Structure

**`/server`**

* `src/index.ts`: Contains the weighted math logic and API endpoints.

**`/client`**

* `src/main.ts`: Entry point, handles scene management (Title <-> Bonus) and resizing.
* `src/BonusScreen.ts`: Main game logic, wheel controller, and animation sequencing.
* `src/Wheel.ts`: Visual construction of the wheel and slices.
* `src/UI.ts`: Global overlay for credit balance and rollup effects.
* `src/DebugPanel.ts`: Tool for forcing specific spin results.

```

```