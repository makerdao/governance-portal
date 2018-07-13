import { Component } from "react";
import { connect } from "react-redux";

import { metamaskConnectInit } from "./reducers/metamask";
import { voteTallyInit } from "./reducers/tally";
import { topicsFetchInit } from "./reducers/topics";
import { ledgerConnectInit } from "./reducers/ledger";

class Init extends Component {
  componentDidMount() {
    this.props.metamaskConnectInit();
    this.props.voteTallyInit();
    this.props.topicsFetchInit();
    this.props.ledgerConnectInit();
  }
  render = () => this.props.children;
}

export default connect(
  () => ({}),
  { metamaskConnectInit, voteTallyInit, topicsFetchInit, ledgerConnectInit }
)(Init);
