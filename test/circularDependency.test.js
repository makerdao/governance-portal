const madge = require('madge');

test.skip('should be no circular dependencies in project', async () => {
  const res = await madge('./src');
  expect(res.circular()).toBe([]);
});
