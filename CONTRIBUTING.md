# Contributing to Termwise

Thank you for considering contributing to Termwise! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

1. **Check existing issues** - Check if the bug has already been reported
2. **Create a detailed report** - Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots (if applicable)
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. **Check existing issues** - Ensure your feature hasn't already been suggested
2. **Describe the feature** - Provide:
   - Clear description of the proposed feature
   - How it would benefit users
   - Any implementation ideas you have

### Code Contributions

1. **Fork the repository**
2. **Create a branch** - `git checkout -b feature/your-feature-name`
3. **Make your changes** - Follow the coding conventions (see below)
4. **Test your changes** - Ensure your changes don't break existing functionality
5. **Commit with clear messages** - `git commit -m "Add feature: brief description"`
6. **Push to your fork** - `git push origin feature/your-feature-name`
7. **Submit a Pull Request** - Include a clear description of your changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/Rubber-Ducky-Development/carleton-course-scheduler.git
cd carleton-course-scheduler

# Install dependencies
npm install

# Run development server
npm run dev
```

## Coding Conventions

- **TypeScript**: Use TypeScript for all new code
- **Component Structure**: Follow existing component patterns
- **State Management**: Use Zustand for global state
- **Styling**: Use TailwindCSS for styling
- **Comments**: Comment complex logic and component props
- **Tests**: Add tests for new features when applicable

## Pull Request Process

1. Update the README.md if necessary
2. Make sure your code passes all tests
3. Your PR will be reviewed by maintainers
4. Address any requested changes
5. Your PR will be merged once approved

## Questions?

If you have any questions about contributing, feel free to open an issue.

Thank you for improving Termwise!
