const pkg = require("./package.json");

module.exports = {
  title: `MKR Gov Components v${pkg.version}`,
  skipComponentsWithoutExample: true,
  styles: {
    Playground: {
      preview: {
        background:
          "linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef), linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef);",
        backgroundPosition: "0 0, 10px 10px;",
        backgroundSize: "20px 20px;"
      }
    }
  },
  getExampleFilename(componentPath) {
    return componentPath
      .replace(
        /\.js?$|src/g,
        matched => (matched === "src" ? "src/_styleguide" : ".md")
      )
      .replace("components/", "")
      .replace("modals/", "");
  }
};
