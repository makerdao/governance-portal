import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect
} from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import BaseLayout from './layouts/base';
import Timeline from './pages/Timeline';
import PollingList from './pages/PollingList';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import Polling from './pages/Polling';
import Executive from './pages/Executive';
import Loader from './components/Loader';

class DynamicImport extends Component {
  state = {
    component: null
  };
  componentDidMount() {
    this.props.load().then(mod =>
      this.setState(() => ({
        component: mod.default
      }))
    );
  }
  render = () =>
    this.state.component ? (
      this.props.children(this.state.component)
    ) : (
      <Loader
        size={20}
        mt={125}
        mb={200}
        color="header"
        background="background"
      />
    );
}

class ScrollToTopUtil extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render = () => this.props.children;
}

const ScrollToTop = withRouter(ScrollToTopUtil);

const CreatePoll = props => (
  <DynamicImport load={() => import('./pages/CreatePoll')}>
    {Component => <Component {...props} />}
  </DynamicImport>
);

class App extends Component {
  mixpanelTrack = routeProps => {
    console.debug(`[Analytics] Tracked: ${routeProps.location.pathname}`);
    mixpanel.track('Pageview', { product: 'governance-dashboard' });
  };

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
                  render={routeProps => {
                    this.mixpanelTrack(routeProps);
                    return <Timeline {...routeProps} />;
                  }}
                />
                <Route
                  path="/polling/create"
                  render={routeProps => {
                    this.mixpanelTrack(routeProps);
                    return <CreatePoll {...routeProps} />;
                  }}
                />
                <Route
                  path="/polling"
                  render={routeProps => {
                    this.mixpanelTrack(routeProps);
                    return <PollingList signaling {...routeProps} />;
                  }}
                />
                <Route path="/not-found" component={NotFound} />
                <Route
                  exact
                  path="/:topicSlug"
                  render={routeProps => {
                    this.mixpanelTrack(routeProps);
                    return <Redirect to="/" />;
                  }}
                />
                <Route
                  path="/polling-proposal/:pollSlug"
                  render={routeProps => {
                    this.mixpanelTrack(routeProps);
                    return <Polling {...routeProps} />;
                  }}
                />
                <Route
                  path="/executive-proposal/:execSlug"
                  render={routeProps => {
                    this.mixpanelTrack(routeProps);
                    return <Executive {...routeProps} />;
                  }}
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
