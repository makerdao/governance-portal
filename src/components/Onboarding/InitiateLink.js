import React from 'react';
import { connect } from 'react-redux';
import { Box, Grid, Text } from '@makerdao/ui-components';

import Sidebar from './shared/Sidebar';
import Stepper from './shared/Stepper';
import ButtonCard from './shared/ButtonCard';
import Header from './shared/Header';

import { initiateLink } from '../../reducers/proxy';

const ChooseTransactionPriority = ({ onChoose }) => {
  return (
    <div>
      <Grid gridRowGap="m" alignContent="start">
        <Header
          title="Select transaction priority"
          subtitle={
            <React.Fragment>
              Note these are estimates of the time and cost per transaction.
              <br />
              There are 4 transactions in total.
            </React.Fragment>
          }
        />
        <ButtonCard
          title="Low"
          subtitle="$0.009 USD < 30 minutes"
          buttonText="Select"
          onNext={onChoose}
        />
        <ButtonCard
          title="Medium"
          subtitle="$0.018 USD <5 minutes"
          buttonText="Select"
          onNext={onChoose}
        />
        <ButtonCard
          title="High"
          subtitle="$0.120 USD • Estimate 2 minutes"
          buttonText="Select"
          onNext={onChoose}
        />
      </Grid>
    </div>
  );
};

const SignHotWallet = () => {
  return (
    <div>
      <Header
        title="Sign MetaMask transaction"
        subtitle="To proceed with setting up your voting contract, 
please sign the transaction in MetaMask."
      />
    </div>
  );
};

class InitiateLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0
    };
  }

  initiateLink = () => {
    this.props.initiateLink({
      hot: this.props.hotWallet,
      cold: this.props.coldWallet
    });
  };

  onTransactionPriorityChosen = priority => {
    this.setState({
      step: 1
    });
  };

  render() {
    return (
      <Box maxWidth="930px" m="0 auto">
        <Grid
          gridColumnGap="xl"
          gridRowGap="m"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <div>
            <Stepper step={this.state.step}>
              <ChooseTransactionPriority
                onChoose={this.onTransactionPriorityChosen}
              />
              <SignHotWallet />
            </Stepper>
          </div>
          <Sidebar
            faqs={[]}
            hotWallet={this.props.hotWallet}
            coldWallet={this.props.coldWallet}
          />
        </Grid>
      </Box>
    );
  }
}

export default connect(
  ({ onboarding }) => ({
    ...onboarding
  }),
  {
    initiateLink
  }
)(InitiateLink);
