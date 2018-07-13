import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import BaseLayout from "./layouts/base";
import theme from "./theme";
import Timeline from "./pages/Timeline";
import Topic from "./pages/Topic";
import Proposal from "./pages/Proposal";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundry";

class ScrollToTopUtil extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render = () => this.props.children;
}

const ScrollToTop = withRouter(ScrollToTopUtil);

class App extends Component {
  render = () => (
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop>
          <div className="App">
            <ErrorBoundary>
              <BaseLayout>
                <Switch>
                  <Route exact path="/" component={Timeline} />
                  <Route path="/not-found" component={NotFound} />
                  <Route
                    path="/:topicSlug/:proposalSlug"
                    component={Proposal}
                  />
                  <Route path="/:topicSlug" component={Topic} />
                </Switch>
              </BaseLayout>
            </ErrorBoundary>
          </div>
        </ScrollToTop>
      </Router>
    </ThemeProvider>
  );
}

export default App;
