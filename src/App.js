import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Topic from "./pages/topic";
import Timeline from "./pages/timeline";
import Proposal from "./pages/proposal";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Timeline} />
          <Route path="/topic/:topicId" component={Topic} />
          <Route path="/proposal/:proposalId" component={Proposal} />
        </div>
      </Router>
    );
  }
}

export default App;
