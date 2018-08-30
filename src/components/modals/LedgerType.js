import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { FlexContainer } from './shared/styles';
import ledgerImg from '../../imgs/ledger.svg';

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
    const { type } = this.props;
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
          <div> Connect button </div>
        </FlexContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(LedgerType);
