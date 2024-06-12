# Parroton

**Parroton** is a simple reinvestment platform built on top of DeDust. This project leverages modern web technologies
including Next.js, TypeScript, TailwindCSS, and more to provide a seamless experience for reinvesting in DeDust.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Development Server](#running-the-development-server)
- [Scripts](#scripts)
- [Main Dependencies](#main-dependencies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

Parroton simplifies the process of reinvesting in DeDust by providing an intuitive platform with enhanced security and
performance.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:

- Node.js (>= 14.0.0)
- pnpm (>= 6.0.0)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/digberi/parroton.git
    ```

2. Navigate to the project directory:
    ```sh
    cd parroton
    ```

3. Install the dependencies:
    ```sh
    pnpm install
    ```

### Running the Development Server

To start the development server, run:

```sh
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Scripts

- **`setup`**: Executes the setup script (`./scripts/setup.js`).
- **`prebuild`**: Executes the prebuild script (`./scripts/prebuild.js`).
- **`dev`**: Runs setup and starts the Next.js development server.
- **`build`**: Runs prebuild and builds the Next.js application for production.
- **`start`**: Starts the Next.js application in production mode.
- **`lint`**: Runs the Next.js linting process.
- **`oxlint`**: Runs the custom `oxlint` with specific plugins and configurations.
- **`g`**: Adds a new component using the Shadcn-UI generator.
- **`type-locales`**: Generates TypeScript types for i18n locales.
- **`dr:build`**: Builds the declarative routing configuration.
- **`dr:build:watch`**: Watches for changes and rebuilds the declarative routing configuration.
- **`prepare`**: Runs Husky to prepare Git hooks.

## Main Dependencies

### Production

- **Next.js**: React framework for server-rendered applications.
- **React**: JavaScript library for building user interfaces.
- **TailwindCSS**: Utility-first CSS framework.
- **i18next**: Internationalization library.
- **Formik**: Form management library for React.
- **Ton**: Libraries for TON blockchain integration.
- **DeDust SDK**: SDK for interacting with DeDust services.

### Development

- **TypeScript**: Superset of JavaScript that adds static typing.
- **ESLint**: Linting utility for JavaScript and TypeScript.
- **Prettier**: Code formatting tool.
- **Husky**: Git hooks manager.
- **Declarative Routing**: Declarative routing configuration.

## Project Structure

- **`/public`**: Static assets.
- **`/src`**: Source code.
    - **`/components`**: React components.
    - **`/app`**: Next.ja app routing and configuration.
    - **`/core`**: Core application logic.
    - **`/hooks`**: Custom React hooks.
    - **`/i18n`**: Internationalization resources.
    - **`/routes`**: Declarative routing configuration.
    - **`/styles`**: Styling files.
    - **`/utils`**: Utility functions.

## Contributing

Contributions are welcome! Please follow the established code style and conventions. For major changes, open an issue
first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.