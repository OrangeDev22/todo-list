module.exports = {
  testEnvironment: "jsdom", // Simulates a browser environment
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Optional setup
  globals: { TextEncoder: TextEncoder, TextDecoder: TextDecoder },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy", // Mock CSS imports
  },
};
