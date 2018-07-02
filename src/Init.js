import { Component } from "react";
import { connect } from "react-redux";

import { metamaskConnectInit } from "./reducers/metamask";
import { voteTallyInit } from "./reducers/voteTally";

class Init extends Component {
  componentDidMount() {
    this.props.metamaskConnectInit();
    this.props.voteTallyInit();
  }
  render() {
    return this.props.children;
  }
}

export default connect(
  () => ({}),
  { metamaskConnectInit, voteTallyInit }
)(Init);
