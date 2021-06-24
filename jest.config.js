module.exports = {
  rootDir: "__tests__",
  transform: {
    "^.+\\.(js|ts)$": "ts-jest"
  },
  bail : false,
  globals: {
    "ts-jest": {
      tsConfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  }
  };