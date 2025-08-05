export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  setupFiles: ["./setupTests.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/_mocks_/fileMock",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
};
