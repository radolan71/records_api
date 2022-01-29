jest.setTimeout(500 * 1000);
global.console = {
  log: console.log, // Use `jest.fn()` to ignore console.log in tests
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};
