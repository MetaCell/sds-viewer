module.exports = {
  rootDir: "__tests__",
  verbose: true,
  bail: false,
  preset: "jest-puppeteer",
  testEnvironment: "jest-environment-puppeteer",
  testEnvironmentOptions: {},
  globals: {
    "ts-jest": {
      tsConfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  }
};