# 🦆 Termwise | Carleton Course Scheduler

<div align="center">
  <img src="/public/og-duck.png" alt="Termwise Duck Logo" width="200">
  <h3>Say goodbye to manual schedule planning!</h3>
</div>

[![Next.js](https://img.shields.io/badge/built%20with-Next.js-000?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Contributors Welcome](https://img.shields.io/badge/contributors-welcome-brightgreen)](CONTRIBUTING.md)
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## ✨ Overview

Termwise is an intelligent course scheduler built for Carleton University students that automatically generates optimal course timetables based on user preferences. No more switching tabs, checking courses by hand, or hunting for overlaps across every plan. Say goodbye to the scheduling cries plan it all smoothly with Termwise :)

**Key Features:**

- 🔄 **Automatic Schedule Generation** - Simply input your courses and constraints, and let our algorithm do the work
- 🎯 **Preference-Based Scheduling** - Set instructor preferences, time of day preferences, and more
- ⏰ **Buffer Time Management** - Ensure you have enough time between classes
- 🔀 **Alternative Schedules** - View multiple schedule options sorted by how well they match your preferences
- 📅 **Visual Calendar View** - Easily visualize your weekly schedule
- 📱 **Mobile-Friendly** - Works across all devices

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Rubber-Ducky-Development/carleton-course-scheduler.git
cd carleton-course-scheduler

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🧩 How It Works

Termwise uses a sophisticated algorithm to generate course schedules while respecting:

1. **Course Requirements** - Ensuring all required courses are included
2. **Time Preferences** - Morning, afternoon, or evening preferences for each day
3. **Instructor Preferences** - Prioritizing preferred instructors when possible
4. **Section Type Preferences** - Lecture, lab, tutorial preferences
5. **Buffer Time** - Maintaining minimum time between classes
6. **Max Classes Per Day** - Limiting the number of classes per day

Our algorithm scores potential schedules based on how well they satisfy these preferences and returns a ranked list of options.

## 🏗️ Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components
│   │   ├── scheduler/    # Scheduler components
│   │   └── ui/           # UI components
│   ├── lib/              # Utilities and helpers
│   │   ├── api/          # API functions
│   │   ├── store/        # State management
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
└── public/               # Static assets
```

## 🤝 Contributing

Contributions are always welcome! Whether it's:

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements

Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Carleton University](https://carleton.ca/) for course data
- [Next.js](https://nextjs.org/) for the React framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Zustand](https://github.com/pmndrs/zustand) for state management

---

<div align="center">
  <p>Made with ❤️ for Carleton University students</p>
  <p>Have questions or feedback? <a href="https://github.com/Rubber-Ducky-Development/carleton-course-scheduler/issues">Open an issue</a> or contribute!</p>
</div>

## ⚠️ Disclaimer

We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Carleton University, or any of its subsidiaries or its affiliates. The official Carleton University website can be found at [https://carleton.ca](https://carleton.ca).
