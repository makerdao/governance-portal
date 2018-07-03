# Awesome Proposal

- Implements [GitHub Flavored Markdown](https://github.github.com/)
- Renders actual, "native" React DOM elements
- Allows you to escape or skip HTML (try toggling the checkboxes above)
- If you escape or skip the HTML, no `dangerouslySetInnerHTML` is used! Yay!

## How about some code?

```js
var React = require("react");
var Markdown = require("react-markdown");

React.render(
  <Markdown source="# Your markdown here" />,
  document.getElementById("content")
);
```

## Tables?

| Feature   | Support |
| --------- | ------- |
| tables    | ✔       |
| alignment | ✔       |
| wewt      | ✔       |

---

## More info?

Read usage information and more on [GitHub](//github.com/rexxars/react-markdown)
