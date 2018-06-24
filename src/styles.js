export const colors = {
  white: "255, 255, 255",
  black: "0, 0, 0"
};

export const fonts = {
  size: {
    tiny: "10px",
    small: "12px",
    smedium: "14px",
    medium: "15px",
    large: "18px",
    big: "22px",
    h1: "42px",
    h2: "32px",
    h3: "24px",
    h4: "20px",
    h5: "17px",
    h6: "14px"
  },
  weight: {
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
    html, body, #root, #router-root {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  
    body {
      font-family: ${fonts.family.SFProText};
      font-style: normal;
      font-stretch: normal;
      font-weight: ${fonts.weight.normal};
      font-size: ${fonts.size.medium};
      overflow-y:auto;
      text-rendering: optimizeLegibility;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
      -webkit-overflow-scrolling: touch;
    }
  
    button {
      background-image: none;
      outline: 0;
      -webkit-box-shadow: none;
              box-shadow: none;
    }
  
    [tabindex] {
      outline: none;
      height: 100%;
    }
  
    a, p, h1, h2, h3, h4, h5, h6 {
        text-decoration: none;
        margin: 0;
        padding: 0;
    }
  
    h1 {
      font-size: ${fonts.size.h1}
    }
    h2 {
      font-size: ${fonts.size.h2}
    }
    h3 {
      font-size: ${fonts.size.h3}
    }
    h4 {
      font-size: ${fonts.size.h4}
    }
    h5 {
      font-size: ${fonts.size.h5}
    }
    h6 {
      font-size: ${fonts.size.h6}
    }
  
    a {
      text-decoration: none;
      color: inherit;
      outline: none;
    }
  
    ul, li {
        list-style: none;
        margin: 0;
        padding: 0;
    }
  
    * {
      box-sizing: border-box !important;
    }
  
    button {
      border-style: none;
      line-height: 1em;
    }
  
    input {
      -webkit-appearance: none;
    }
  
    input[type="color"],
    input[type="date"],
    input[type="datetime"],
    input[type="datetime-local"],
    input[type="email"],
    input[type="month"],
    input[type="number"],
    input[type="password"],
    input[type="search"],
    input[type="tel"],
    input[type="text"],
    input[type="time"],
    input[type="url"],
    input[type="week"],
    select:focus,
    textarea {
      font-size: 16px;
    }
  `;
