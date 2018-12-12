export const colors = {
  white: '255, 255, 255',
  green: '48, 189, 159',
  header: '14, 16, 41',
  background: '246, 248, 249',
  light_grey: '234, 239, 247',
  box_dark: '5, 60, 75',
  box_light: '67, 83, 103',
  dark_grey: '39, 39, 39',
  dark_green: '43, 169, 142',
  darker_green: '38,148,125',
  dark: '12, 12, 13',
  black: '0, 0, 0',
  light_grey2: '226, 233, 236', // <-- same as theme.generic.light_grey
  dark_grey2: '203, 209, 213' // <-- same as theme.generic.dark_grey
};

export const fonts = {
  size: {
    tiny: '10px',
    small: '12px',
    medium: '16px',
    large: '20px',
    xlarge: '24px',
    h1: '42px',
    h2: '32px'
  },
  weight: {
    thin: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  family: {
    System:
      '-apple-system, system-ui, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  }
};

export const shadows = {
  soft:
    '0 4px 6px 0 rgba(50, 50, 93, 0.11), 0 1px 3px 0 rgba(0, 0, 0, 0.08), inset 0 0 1px 0 rgba(0, 0, 0, 0.06)',
  medium:
    '0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(50, 50, 93, 0.02), 0 5px 10px 0 rgba(59, 59, 92, 0.08)',
  big:
    '0 15px 35px 0 rgba(50, 50, 93, 0.06), 0 5px 15px 0 rgba(50, 50, 93, 0.15)',
  hover:
    '0 7px 14px 0 rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.08), inset 0 0 1px 0 rgba(0, 0, 0, 0.06)'
};

export const responsive = {
  short: {
    min: 'min-height: 479px',
    max: 'max-height: 480px'
  },
  xs: {
    min: 'min-width: 479px',
    max: 'max-width: 480px'
  },
  sm: {
    min: 'min-width: 639px',
    max: 'max-width: 640px'
  },
  md: {
    min: 'min-width: 959px',
    max: 'max-width: 960px'
  },
  lg: {
    min: 'min-width: 1023px',
    max: 'max-width: 1024px'
  }
};

const theme = {
  bg: {
    default: '#f6f8f9',
    reverse: '#16171A',
    wash: '#F5F8FC',
    border: '#DFE7EF',
    hairline: '#A3AFBF',
    inactive: '#DFE7EF'
  },
  brand: {
    default: '#30bd9f',
    alt: '#7B16FF',
    wash: '#E8E5FF',
    border: '#DDD9FF',
    dark: '#2A0080'
  },
  generic: {
    default: '#ededed',
    white: '#ffffff',
    black: '#000000',
    light_grey: '#E2E9EC',
    dark_grey: '#CBD1D5',
    blue: '#2F80ED',
    dark: '#0c0c0d',
    alt: '#F6FBFC'
  },
  text: {
    default: '#1F2C3C',
    dark_default: '#c4c4c4',
    darker_default: '#0e1029',
    dark_link: '#212536',
    blue_link: '#3080ed',
    green: '#30bd9f',
    header_dim: '#9AA3AD',
    dim_green: '#ACDAD0',
    dim_grey: '#848484',
    dim_grey_alt: '#868997',
    alt: '#546978'
  },
  warn: {
    default: '#c21f3a',
    alt: '#E2197A'
  },
  fonts: {
    size: {
      small: '12px',
      medium: '14px',
      large: '16px',
      xlarge: '28px',
      h1: '42px',
      h2: '32px'
    },
    weight: {
      thin: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  transitions: {
    base: 'all 0.2s ease-in-out',
    long: 'all 0.3s ease-in-out',
    x_long: 'all 0.4s ease-in-out',
    button: '0.15s ease'
  }
};

export default theme;
