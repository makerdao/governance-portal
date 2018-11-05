import { injectGlobal } from 'styled-components';
import { fonts, colors } from './theme';

const globalStyles = `
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
  }
  html {
    display: flex;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
    box-sizing: border-box;
    line-height: 1.5;
    font-size: 10px;
    color: #53546A;
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    font-family: ${fonts.family.System};
  }

  body {
    font-family: ${fonts.family.System};
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
    color: #3080ed;
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
    line-height: 30px;
    color: #546978;
    font-family: ${fonts.family.System};
  }
  .markdown p {
    color: inherit;
    font-size: 16px;
    font-weight: 400;
    display: block;
  }
  .markdown p + p {
    margin-top: 16px;
  }
  // .markdown > *:first-of-type {
  //   margin-top: 16px;
  // }
  .markdown img {
    margin-top: 16px;
    max-width: 100%;
    display: inline;
    border-radius: 4px;
    display: block;
    margin: 12px 0;
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
    list-style-type: circle;
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
    height: 2px;
    background: #EAEAEA;
    display: block;

  }
  .markdown h1 {
    font-size: 28px;
    line-height: normal;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 8px;
    color: #0E1029;
  }
  .markdown h2 {
    font-size: 20px;
    line-height: normal;
    font-weight: 500;
    margin-top: 3rem;
    margin-bottom: 8px;
    color: #0E1029;
  }
  .markdown h3 {
    font-size: 18px;
    line-height: normal;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 8px;
    color: #0E1029;
  }
  .markdown h4 {
    font-size: 16px;
    line-height: 26px;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 8px;
    color: #0E1029;
  }
  .markdown h5 {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 8px;
    text-transform: lowercase;
    font-variant: small-caps;
    color: #0E1029;
  }
  .markdown h6 {
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 8px;
    text-transform: lowercase;
    font-variant: small-caps;
    color: #0E1029;
  }
  `;

injectGlobal`${globalStyles}`;
