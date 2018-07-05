export const colors = {
  white: "255, 255, 255",
  green: "48, 189, 159",
  header: "31, 44, 60",
  background: "246,248,249",
  light_grey: "	234, 239, 247",
  dark_grey: "39, 39, 39",
  dark: "12, 12, 13",
  black: "0, 0, 0"
};

export const fonts = {
  size: {
    tiny: "10px",
    small: "12px",
    medium: "16px",
    large: "20px",
    xlarge: "24px",
    h1: "42px",
    h2: "32px"
  },
  weight: {
    thin: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  family: {
    SFProText:
      '-apple-system, system-ui, BlinkMacSystemFont, "SF Pro Text", Roboto, Helvetica, Arial, sans-serif'
  }
};

export const shadows = {
  soft:
    "0 4px 6px 0 rgba(50, 50, 93, 0.11), 0 1px 3px 0 rgba(0, 0, 0, 0.08), inset 0 0 1px 0 rgba(0, 0, 0, 0.06)",
  medium:
    "0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(50, 50, 93, 0.02), 0 5px 10px 0 rgba(59, 59, 92, 0.08)",
  big:
    "0 15px 35px 0 rgba(50, 50, 93, 0.06), 0 5px 15px 0 rgba(50, 50, 93, 0.15)",
  hover:
    "0 7px 14px 0 rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.08), inset 0 0 1px 0 rgba(0, 0, 0, 0.06)"
};

export const transitions = {
  short: "all 0.1s ease-in-out",
  base: "all 0.2s ease-in-out",
  long: "all 0.3s ease-in-out",
  button: "0.15s ease",
  buttonPress: "0.15s ease"
};

export const responsive = {
  short: {
    min: "min-height: 479px",
    max: "max-height: 480px"
  },
  xs: {
    min: "min-width: 479px",
    max: "max-width: 480px"
  },
  sm: {
    min: "min-width: 639px",
    max: "max-width: 640px"
  },
  md: {
    min: "min-width: 959px",
    max: "max-width: 960px"
  },
  lg: {
    min: "min-width: 1023px",
    max: "max-width: 1024px"
  }
};

export const globalStyles = `  
    * {
    border: 0;
    box-sizing: inherit;
    -webkit-font-smoothing: antialiased;
    font-weight: inherit;
    margin: 0;
    outline: 0;
    padding: 0;
    text-decoration: none;
    text-rendering: optimizeLegibility;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  html {
    display: flex;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.5;
    color: #16171a;
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    font-family: ${fonts.family.SFProText};
  }

  body {
    font-family: ${fonts.family.SFProText};
    font-style: normal;
    font-stretch: normal;
    font-weight: ${fonts.weight.normal};
    font-size: ${fonts.size.medium};
    background-color: rgb(${colors.background});
    display: flex;
    box-sizing: border-box;
    flex: auto;
    align-self: stretch;
    max-width: 100%;
    max-height: 100%;
    -webkit-overflow-scrolling: touch;
  }
  a {
    color: currentColor;
    text-decoration: none;
  }
  a:hover {
    cursor: pointer;
  }
  textarea {
    resize: none;
  }
  ::-moz-selection {
    /* Code for Firefox */
    background: #5574CA;
    color: #ffffff;
  }
  ::selection {
    background: #5574CA;
    color: #ffffff;
  }
  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: #a3afbf;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #a3afbf;
    opacity: 1;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #a3afbf;
    opacity: 1;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #a3afbf;
  }
  #root {
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    flex-direction: column;
    -ms-flex-direction: column;
    -moz-flex-direction: column;
    -webkit-flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .fade-enter {
    opacity: 0;
    z-index: 1;
  }
  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 250ms ease-in;
  }
  .markdown {
    font-size: 16px;
    line-height: 24px;
    color: #16171a;
  }
  .markdown p {
    color: inherit;
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    display: block;
  }
  .markdown p + p {
    margin-top: 16px;
  }
  .markdown > *:first-of-type {
    margin-top: 16px;
  }
  .markdown img {
    margin-top: 16px;
    max-width: 100%;
    display: inline;
    border-radius: 4px;
    transition: box-shadow 0.2s;
    display: block;
    margin: 12px 0;
  }
  .markdown img:hover {
    cursor: pointer;
    transition: box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  .markdown em {
    color: inherit;
    font-size: inherit;
    font-style: italic;
  }
  .markdown strong {
    color: inherit;
    font-size: inherit;
    font-weight: 700;
  }
  .markdown ul,
  .markdown ol {
    color: inherit;
    margin: 8px 0;
    margin-left: 16px;
  }
  .markdown li {
    color: inherit;
    font-size: 16px;
    margin-bottom: 4px;
    line-height: 1.5;
    font-weight: 400;
  }
  .markdown blockquote {
    color: #828c99;
    border-left: 4px solid #7b16ff;
    padding: 4px 8px 4px 16px;
    font-size: 24px;
    font-weight: 300;
    font-style: italic;
    line-height: 1.4;
    margin: 16px 0;
  }
  .markdown blockquote p {
    margin-top: 0;
  }
  .markdown a {
    color: #3080ed;
  }
  .markdown a:visited {
    opacity: 0.6;
    transition: opacity 0.2s ease-in;
  }
  .markdown code {
    font-family: 'Input Mono', 'Menlo', 'Inconsolata', 'Roboto Mono', monospace;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    background-color: #f5f8fc;
    padding: 2px 4px;
    display: inline;
    width: 100%;
    border: 1px solid #dfe7ef;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  .markdown pre {
    margin: 16px 0;
    display: block;
  }
  .markdown pre code {
    padding: 8px 16px;
    display: block;
    white-space: pre-wrap;
    position: relative;
  }
  .markdown div[data-block='true'] {
    margin-top: 12px;
  }
  .markdown div[data-block='true']:first-of-type {
    margin-top: 0;
  }
  .markdown span[data-text='true'] {
    line-height: 1.4;
  }
  .markdown code span {
    max-width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .markdown hr {
    width: 100%;
    height: 1px;
    background: #dfe7ef;
    display: block;
    margin: 32px 0;
  }
  .markdown h1 {
    font-size: 24px;
    line-height: 40px;
    font-weight: 800;
    margin-top: 1rem;
    margin-bottom: 8px;
  }
  .markdown h2 {
    font-size: 20px;
    line-height: 32px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
  }
  .markdown h3 {
    font-size: 18px;
    line-height: 28px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
  }
  .markdown h4 {
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
    text-transform: lowercase;
    font-variant: small-caps;
  }
  .markdown h5 {
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
    text-transform: lowercase;
    font-variant: small-caps;
  }
  .markdown h6 {
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
    text-transform: lowercase;
    font-variant: small-caps;
  }
  `;
