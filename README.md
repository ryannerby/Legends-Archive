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
├── server/          # Express backend (TypeScript)
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── test/        # Test files
│   └── dist/        # Compiled JavaScript (after build)
└── README.md
```

## Important Notes

- Backend is written in TypeScript and compiles to JavaScript
- Tests run against a separate test database
- Environment variables are required for database connections
- Make sure MongoDB is running before starting the application