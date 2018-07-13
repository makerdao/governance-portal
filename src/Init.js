import { Component } from "react";
import { connect } from "react-redux";

import { metamaskConnectInit } from "./reducers/metamask";
import { ledgerConnectInit } from "./reducers/ledger";

class Init extends Component {
  componentDidMount() {
    this.props.metamaskConnectInit();
    this.props.ledgerConnectInit();
  }
  render = () => this.props.children;
}

export default connect(
  () => ({}),
  { metamaskConnectInit, ledgerConnectInit }
)(Init);
