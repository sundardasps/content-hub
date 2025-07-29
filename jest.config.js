module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // changed from .js to .ts
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
};
