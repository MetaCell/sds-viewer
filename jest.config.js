module.exports = {
  rootDir: "__tests__",
  bail : false,
  preset: "jest-puppeteer",
  globals: {
    "ts-jest": {
      tsConfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  }
  };