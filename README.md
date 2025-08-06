# Legends Archive

The main purpose of the app is to provide competition car dealers with a tool that lets them compile and collate the histories of their cars, for easy viewing. The app will display in a clean format, and will enable buyers to get a full understanding of the car they are looking at.

## Tech Stack

**Front End:** React

**Back End:** Express & Node.js with TypeScript, MongoDB

## Installation & Setup

### Prerequisites
- MongoDB running locally
- Node.js installed

### 1. Clone and Install
```bash
# Fork the repo and clone to your local machine
git clone <your-repo-url>
cd Legends-Archive

# Install root dependencies
npm install
```

### 2. Backend Setup (TypeScript)
```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual MongoDB connection string

# For testing, also create test environment
cp .env.test.example .env.test
# Edit .env.test with your test database connection
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd client

# Install client dependencies
npm install

# Install Playwright for E2E testing
npx playwright install
```

## Development

### Running the Application

**Start Backend (TypeScript):**
```bash
cd server
npm run dev  # Uses ts-node for development
```

**Start Frontend:**
```bash
cd client
npm run dev
```

**Or run both from root:**
```bash
# Start both frontend and backend
npm run dev

# Or individually
npm run dev:server
npm run dev:client
```

### Building for Production

**Backend:**
```bash
cd server
npm run build  # Compiles TypeScript to JavaScript
npm start      # Runs the compiled JavaScript
```

## Testing

### Running Tests

**Run all tests (frontend and backend):**
```bash
npm test
```

**Backend tests only:**
```bash
cd server
npm test
```

**Frontend tests only:**
```bash
cd client
npm test
```

**Development with watch mode:**
```bash
cd server
npm run test:watch
```

### E2E Testing with Playwright

**Prerequisites:**
Make sure you have Playwright installed:
```bash
cd client
npm install
npx playwright install
```

**Start Your Servers:**
```bash
# Terminal 1 - Start the backend server
cd server
npm run dev

# Terminal 2 - Start the frontend server  
cd client
npm run dev
```

**Run E2E Tests:**

#### Option 1: Run All Tests (Recommended)
```bash
cd client
npm run test:e2e
```

#### Option 2: Run with Visual UI (For Debugging)
```bash
cd client
npm run test:e2e:ui
```
This opens a browser window where you can see tests running and debug issues.

#### Option 3: Run with Browser Visible
```bash
cd client
npm run test:e2e:headed
```
This runs tests with the browser window open so you can see what's happening.

### What the E2E Tests Do

#### 1. Car Management Tests (`car-management.spec.ts`)
- ✅ Creates a new car and verifies it appears in the list
- ✅ Navigates to car details and adds history events
- ✅ Deletes history events and verifies they're removed

#### 2. Navigation Tests (`navigation.spec.ts`)
- ✅ Verifies home page loads correctly
- ✅ Checks that external links open in new tabs
- ✅ Ensures all main page elements are visible

#### 3. Helper Functions (`test-helpers.ts`)
These make tests cleaner and reusable:
- `createTestCar()` - Creates a car with given data
- `addHistoryEvent()` - Adds a history event to a car

### How to Add New E2E Tests

#### Create a New Test File:
```typescript
// client/e2e/my-new-test.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My New Feature', () => {
  test('should do something cool', async ({ page }) => {
    await page.goto('/');
    // Your test code here
  });
});
```

#### Use Helper Functions:
```typescript
import { createTestCar, addHistoryEvent } from './utils/test-helpers';

test('should create car and add history', async ({ page }) => {
  // Create a car using helper
  await createTestCar(page, {
    name: 'Test Porsche',
    year: '1985',
    chassisNumber: 'WP0ZZZ91ZFS123456'
  });
  
  // Add history using helper
  await addHistoryEvent(page, {
    title: 'Engine Rebuild',
    date: '2024-01-15',
    description: 'Complete engine overhaul'
  });
});
```

### E2E Test Results

When tests run successfully, you'll see:
```
✓ Car Management (3 tests)
✓ Navigation (1 test)

4 passed
```

### Troubleshooting E2E Tests

#### Tests Fail? Check These:

1. **Servers Running?**
   ```bash
   # Backend should be on port 5001
   curl http://localhost:5001/cars
   
   # Frontend should be on port 5173
   curl http://localhost:5173
   ```

2. **Database Connected?**
   - Make sure MongoDB is running
   - Check your `.env` file has correct `MONGO_URI`

3. **Playwright Installed?**
   ```bash
   cd client
   npx playwright install
   ```

#### Common Issues:

**"Page not found" errors:**
- Make sure both servers are running
- Check ports (5001 for backend, 5173 for frontend)

**"Element not found" errors:**
- Use the UI mode to see what's happening: `npm run test:e2e:ui`
- Check if the page structure changed

**"Timeout" errors:**
- Increase wait times in tests
- Check if the app is slow to load

### Test Setup
1. Make sure MongoDB is running locally
2. Tests use a separate test database (`legends-archive-test`)
3. Tests automatically clean up after themselves
4. The `--detectOpenHandles` flag helps identify hanging connections

### Environment Variables

**Development (.env):**
```
MONGO_URI=mongodb://localhost:27017/legends-archive
PORT=5001
```

**Testing (.env.test):**
```
MONGO_URI=mongodb://localhost:27017/legends-archive-test
```

## Project Structure

```
Legends-Archive/
├── client/          # React frontend
│   ├── e2e/        # E2E test files
│   │   ├── car-management.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── utils/  # Test helper functions
│   └── src/
├── server/          # Express backend (TypeScript)
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── test/        # Test files
│   └── dist/        # Compiled JavaScript (after build)
└── README.md
```

## Quick Start for New Developers

1. **Install dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Start servers:**
   ```bash
   # Terminal 1
   cd server && npm run dev
   
   # Terminal 2  
   cd client && npm run dev
   ```

3. **Run tests:**
   ```bash
   # Terminal 3
   cd client && npm run test:e2e
   ```

## Important Notes

- Backend is written in TypeScript and compiles to JavaScript
- Tests run against a separate test database
- Environment variables are required for database connections
- Make sure MongoDB is running before starting the application
- E2E tests require both frontend and backend servers to be running