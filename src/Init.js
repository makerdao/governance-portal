import { Component } from "react";
import { connect } from "react-redux";

import { metamaskConnectInit } from "./reducers/metamask";
import { voteTallyInit } from "./reducers/tally";
import { topicsFetchInit } from "./reducers/topics";

class Init extends Component {
  componentDidMount() {
    this.props.metamaskConnectInit();
    this.props.voteTallyInit();
    this.props.topicsFetchInit();
  }
  render = () => this.props.children;
}

export default connect(
  () => ({}),
  { metamaskConnectInit, voteTallyInit, topicsFetchInit }
)(Init);
