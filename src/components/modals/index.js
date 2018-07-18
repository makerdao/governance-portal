import React, { Component } from 'react';
// import PropTypes from "prop-types";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { modalClose } from '../../reducers/modal';
import {
  initiateLink,
  sendMkrToProxy,
  approveLink,
  clear as proxyClear
} from '../../reducers/proxy';
import { sendVote } from '../../reducers/vote';
import { getActiveAccount } from '../../reducers/accounts';
import ProxySetup from './ProxySetup';
import Card from '../Card';
import { colors, transitions, responsive } from '../../theme';

const Column = styled.div`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? '100%' : 'auto')};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
`;

const StyledLightbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: ${transitions.base};
  opacity: ${({ modal }) => (modal ? 1 : 0)};
  visibility: ${({ modal }) => (modal ? 'visible' : 'hidden')};
  pointer-events: ${({ modal }) => (modal ? 'auto' : 'none')};
  background: rgba(${colors.dark}, 0.2);
`;

const StyledHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ModalCard = Card.extend`
  padding: 30px 26px;
  @media screen and (${responsive.sm.max}) {
    padding: 15px;
    & h4 {
      margin: 20px auto;
    }
  }
`;

const Centered = styled.div`
  position: fixed;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 15px;
`;

const CloseButton = styled(props => <div {...props}>&times;</div>)`
  height: 28px;
  width: 28px;
  border-radius: 28px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.2);
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  font-size: 26px;
  line-height: 19px;
  text-align: center;
`;

class Modal extends Component {
  modalController = () => {
    switch (this.props.modal) {
      case 'PROXY_SETUP':
        return <ProxySetup {...this.props} />;
      default:
        if (typeof this.props.modal === 'function')
          return <this.props.modal {...this.props} />;
        return <div />;
    }
  };

  render() {
    const body = document.body || document.getElementsByTagName('body')[0];
    const { modal, modalClose } = this.props;

    if (modal) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }

    return (
      <StyledLightbox modal={!!modal}>
        <StyledHitbox onClick={modalClose} />
        <Centered>
          <Column maxWidth={600} center>
            <ModalCard maxWidth={600} background="white">
              <CloseButton onClick={modalClose} />
              {this.modalController()}
            </ModalCard>
          </Column>
        </Centered>
      </StyledLightbox>
    );
  }
}

Modal.propTypes = {};

const reduxProps = ({ modal, metamask, vote, accounts, proxy }) => ({
  modal: modal.modal,
  modalProps: modal.modalProps,
  account: metamask.accountAddress,
  activeAccount: getActiveAccount({ accounts }),
  network: metamask.network === 'kovan' ? 'kovan' : 'mainnet',
  initiateLinkTxHash: proxy.initiateLinkTxHash,
  sendMkrTxHash: proxy.sendMkrTxHash,
  approveLinkTxHash: proxy.approveLinkTxHash,
  hotAddress: proxy.hot,
  voteTxHash: vote.txHash
});

export default connect(
  reduxProps,
  {
    modalClose,
    initiateLink,
    approveLink,
    sendMkrToProxy,
    sendVote,
    proxyClear
  }
)(Modal);
