import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect
} from 'react-router-dom';
import BaseLayout from './layouts/base';
import Timeline from './pages/Timeline';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import Polling from './pages/Polling';
import Executive from './pages/Executive';

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
    <Router>
      <ScrollToTop>
        <div className="App">
          <ErrorBoundary>
            <BaseLayout>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={routeProps => <Timeline {...routeProps} />}
                />
                <Route
                  path="/polling"
                  render={routeProps => <Timeline signaling {...routeProps} />}
                />
                <Route path="/not-found" component={NotFound} />
                <Route
                  exact
                  path="/:topicSlug"
                  render={() => <Redirect to="/" />}
                />
                <Route
                  path="/polling-proposal/:pollSlug"
                  render={routeProps => <Polling {...routeProps} />}
                />
                <Route
                  path="/executive-proposal/:execSlug"
                  render={routeProps => <Executive {...routeProps} />}
                />
              </Switch>
            </BaseLayout>
          </ErrorBoundary>
        </div>
      </ScrollToTop>
    </Router>
  );
}

export default App;
