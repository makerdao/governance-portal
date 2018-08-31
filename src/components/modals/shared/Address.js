import React from 'react';
import { cutMiddle } from '../../../utils/misc';
import { getMkrBalance } from '../../../chain/read';
import { connect } from 'react-redux';

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.address,
      balance: 0,
      network: props.network,
      index: props.index,
      handler: props.handler
    };
  }

  async componentDidMount() {
    const balance = await getMkrBalance(this.state.address, this.state.network);
    this.setState({ balance: balance });
  }

  render() {
    return (
      <React.Fragment>
        <td>{cutMiddle(this.state.address, 9, 10)}</td>
        <td>
          {this.state.balance} {'MKR'}
        </td>
        <td>TBD</td>
        <td>
          <button
            onClick={() => {
              this.state.handler();
            }}
          >
            checkBox
          </button>
        </td>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  network: state.metamask.network
});

export default connect(mapStateToProps)(Address);
