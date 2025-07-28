# Notes Platform

A simple Node.js + Express notes platform for practicing Cypress end-to-end testing and GitHub Actions CI/CD.

## Features
- User registration and login (with SQLite3)
- Session-based authentication
- Dashboard with user-specific notes
- Note creation
- Logout

## Tech Stack
- Node.js, Express
- SQLite3
- EJS templates
- express-session
- Cypress for E2E tests
- GitHub Actions for CI

## Setup
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the app:**
   ```sh
   npm run dev
   ```
   The app runs on [http://localhost:3000](http://localhost:3000)

3. **Run Cypress tests:**
   - Open Cypress UI:
     ```sh
     npm run cypress:open
     ```
   - Run Cypress headless:
     ```sh
     npm run cypress:run
     ```

## CI/CD
- On push to `main` or `staging`, GitHub Actions will install dependencies, start the app, and run Cypress tests in headless mode.

## Directory Structure
```
.
├── server.js
├── db.sqlite (auto-generated)
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── new-note.ejs
├── public/
├── cypress/
│   └── e2e/
│       └── register.cy.js
├── .github/
│   └── workflows/
│       └── cypress.yml
├── package.json
└── README.md
``` 
