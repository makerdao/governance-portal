import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import theme from "./theme";
import Timeline from "./pages/Timeline";
import Topic from "./pages/Topic";
import Proposal from "./pages/Proposal";
import NotFound from "./pages/NotFound";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Timeline} />
              <Route path="/not-found" component={NotFound} />
              <Route path="/:topicSlug/:proposalSlug" component={Proposal} />
              <Route path="/:topicSlug" component={Topic} />
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
