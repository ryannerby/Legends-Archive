export default {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx"],
    setupFiles: ["./setupTests.js"],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "<rootDir>/_mocks_/styleMock.js",
    },
  };
  