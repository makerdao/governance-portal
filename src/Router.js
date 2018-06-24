import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Topic from "./pages/Topic";
import Timeline from "./pages/Timeline";
import Proposal from "./pages/Proposal";
import NotFound from "./pages/NotFound";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Timeline} />
            <Route path="/topic/:topicId" component={Topic} />
            <Route path="/proposal/:proposalId" component={Proposal} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
