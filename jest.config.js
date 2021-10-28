module.exports = {
  rootDir: "__tests__",
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