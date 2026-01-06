# SADAR Platform 🚗💤

**SADAR sebelum terlambat.**

Sadar Platform is an AI-powered copilot designed to enhance driver safety. It uses real-time computer vision to detect drowsiness and distraction, providing immediate alerts and emergency assistance to prevent accidents.

## 🌟 Key Features

- **👀 Real-time Drowsiness Detection**: Uses MediaPipe Face Landmarker to monitor eye closure and head pose in real-time.
- **🚨 Instant Alerts**: Visual and audio warnings when drowsiness or critical distraction is detected.
- **🆘 Emergency SOS**: One-tap emergency trigger to notify contacts or services (via Twilio integration).
- **🗣️ Voice Assistant**: Hands-free interaction for safety queries and controls.
- **📊 Live Dashboard**: Real-time status monitoring (Aware, Drowsy, Critical).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Computer Vision**: [MediaPipe Tasks Vision](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)
- **Icons**: Lucide React
- **Backend/API**: Next.js Server Actions / API Routes

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rafkiyuda/sadar-platform.git
    cd sadar-platform
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add the necessary keys:
    ```env
    gemini_api_key=YOUR_GEMINI_API_KEY
    TWILIO_ACCOUNT_SID=your_twilio_sid
    TWILIO_AUTH_TOKEN=your_twilio_token
    TWILIO_FROM_NUMBER=your_twilio_number
    EMERGENCY_CONTACT_NUMBER=target_emergency_number
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## 🤝 Contributing

We follow the **Conventional Commits** specification for commit messages. Please ensure your commits follow this format:

```
<type>(<scope>): <subject>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Example:**
- `feat(auth): add login functionality`
- `docs(readme): update installation instructions`
- `fix(vision): calibrate eye closure threshold`

## 📄 License

[MIT](LICENSE)
