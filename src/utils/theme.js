import { themeLight } from '@makerdao/ui-components-core';

const theme = {
  widths: {
    ...themeLight.widths,
    app: '111.4rem'
  },
  ...themeLight,
  footer: {
    ...themeLight.footer,
    backgroundColor: '#f6f8f9'
  }
};
export default theme;

const is = n => n !== undefined && n !== null;

function get(obj, ...paths) {
  const value = paths.reduce((acc, path) => {
    if (is(acc)) return acc;
    const keys = typeof path === 'string' ? path.split('.') : [path];
    return keys.reduce((a, key) => (a && is(a[key]) ? a[key] : null), obj);
  }, null);
  return is(value) ? value : paths[paths.length - 1];
}

export function getColor(key) {
  return get(theme.colors, key);
}
