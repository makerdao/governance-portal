import React, { Fragment, Component } from 'react';
import { cutMiddle } from '../../../utils/misc';
import { getMkrBalance } from '../../../chain/read';
import { connect } from 'react-redux';

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.address,
      balance: 0,
      network: props.network
    };
  }

  async componentDidMount() {
    const balance = await getMkrBalance(this.state.address, this.state.network);
    this.setState({ balance: balance });
  }

  render() {
    return (
      <React.Fragment>
        <span>{cutMiddle(this.state.address, 33, 33)}</span>
        <span>
          {' '}
          {this.state.balance} {'MKR'}
        </span>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  network: state.metamask.network
});

export default connect(mapStateToProps)(Address);
