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

const Type = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #212536;
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: #48495f;
`;

const LedgerIcon = styled.div`
  margin-right: 16px;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 60px;
  background: url(${ledgerImg}) center no-repeat;
  background-color: #e8e8e8;
  background-size: 157px;
  background-position: 13px 13px;
`;

const Wrapper = styled(FlexContainer)`
  align-items: flex-start;
`;

const Blurb = styled.div`
  margin-top: 5px;
  margin-right: 16px;
`;

const ConnectButton = styled(Button)`
  margin-top: 10px;
  width: 120px;
`;

class LedgerType extends React.Component {
  render() {
    const { type, modalOpen } = this.props;
    const typeCaps = type.charAt(0).toUpperCase() + type.slice(1);
    return (
      <Wrapper>
        <LedgerIcon />
        <Blurb>
          <Type>Ledger {typeCaps}</Type>
          <Description>
            {type === 'live'
              ? 'You created your wallet using Ledger Live.'
              : 'You created your wallet prior to Ledger Live.'}{' '}
            <a>Read more</a>
          </Description>
        </Blurb>
        <ConnectButton
          slim
          onClick={() =>
            modalOpen(AddressSelection, {
              ledger: true,
              path: type === 'live' ? LEDGER_LIVE_PATH : LEDGER_LEGACY_PATH
            })
          }
        >
          Connect
        </ConnectButton>
      </Wrapper>
    );
  }
}

export default connect(
  null,
  { modalOpen }
)(LedgerType);
