## Overview

This project is a draft test automation framework using [Playwright](https://playwright.dev/) for end-to-end testing. It is created as part of the registration process for the EPAM course "Automated Testing Global Mentoring Program: Advanced".

## Features

- Automated browser testing with Playwright
- Example test cases for demonstration
- Easy to extend and maintain

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/Wheelpy/report-portal-test.git
cd report-portal-test
npm install
```

### Running Tests

```bash
npx playwright test
```

## Project Structure

```
report-portal-test/
├── fixtures/                # Test data and fixtures
├── flows/                   # Test flows and scenarios
├── pages/                   # Page objects and components
│   └── components/          # Reusable UI components
├── tests/                   # Test cases
├── utils/                   # Utility functions and helpers
├── playwright.config.ts     # Playwright configuration
├── package.json             # Project metadata and dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Useful Links

- [Playwright Documentation](https://playwright.dev/docs/intro)

## License

This project is for educational purposes only.