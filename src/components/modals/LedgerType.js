import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { FlexContainer } from './shared/styles';
import ledgerImg from '../../imgs/ledger.svg';
import Button from '../Button';
import { modalOpen } from '../../reducers/modal';
import AddressSelection from './AddressSelection';

export const LEDGER_LIVE_PATH = "44'/60'/0'/0/0";
export const LEDGER_LEGACY_PATH = "44'/60'/0'/0";

const StyledType = styled.div`
  font-size: 20px;
  color: #212536;
`;

const StyledDescription = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: #48495f;
`;

const LedgerIcon = styled.p`
  margin-left: 17px;
  margin-top: 16px;
  width: 22px;
  height: 22px;
  background-color: #fff;
  mask: url(${ledgerImg}) center no-repeat;
`;

const Circle = styled.div`
  margin-right: ${({ mr }) => (mr ? `${mr}px` : '')};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '')};
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: #f85d2d;
`;

class LedgerType extends React.Component {
  render() {
    const { type, modalOpen } = this.props;
    return (
      <React.Fragment>
        <FlexContainer>
          <Circle>
            <LedgerIcon />
          </Circle>
          <div>
            <StyledType> Ledger {type} </StyledType>
            <StyledDescription>
              {' '}
              {type === 'live'
                ? 'You created your wallet using Ledger Live.'
                : 'You created your wallet prior to Ledger Live.'}
              <a> Read more</a>
            </StyledDescription>
          </div>
          <Button
            slim
            onClick={() =>
              modalOpen(AddressSelection, {
                ledger: true,
                path: type === 'live' ? LEDGER_LIVE_PATH : LEDGER_LEGACY_PATH
              })
            }
          >
            {' '}
            Connect{' '}
          </Button>
        </FlexContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { modalOpen }
)(LedgerType);
