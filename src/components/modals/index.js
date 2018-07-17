import React, { Component } from 'react';
// import PropTypes from "prop-types";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { modalClose } from '../../reducers/modal';
import { initiateLink, sendMkrToProxy } from '../../reducers/proxy';
import { sendVote } from '../../reducers/vote';
import ProxySetup from './PoxySetup';
import Vote from './Vote';
import Card from '../Card';
import close from '../../imgs/close.svg';
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
  top: 9%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 15px;
`;

const StyledClose = styled.div`
  height: 36px;
  width: 36px;
  margin-left: auto;
  margin-top: -8px;
  margin-bottom: 8px;
  cursor: pointer;
  visibility: ${({ modal }) => (modal ? 'visible' : 'hidden')};
  background: url(${close}) no-repeat;
`;

const ModalTopper = styled.div`
  width: 600px;
`;

class Modal extends Component {
  modalController = () => {
    switch (this.props.modal) {
      case 'PROXY_SETUP':
        window.scrollTo(50, 50);
        return <ProxySetup {...this.props} />;
      case 'VOTE':
        return <Vote {...this.props} />;
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
      <StyledLightbox modal={modal}>
        <Centered>
          <StyledHitbox onClick={modalClose} />
          <Column maxWidth={600} center>
            <ModalTopper>
              <StyledClose modal={modal} onClick={modalClose} />
            </ModalTopper>
            <ModalCard maxWidth={600} background="white">
              {this.modalController()}
            </ModalCard>
          </Column>
        </Centered>
      </StyledLightbox>
    );
  }
}

Modal.propTypes = {};

const reduxProps = ({ modal, metamask, vote }) => ({
  modal: modal.modal,
  modalProps: modal.modalProps,
  account: metamask.accountAddress,
  network: metamask.network === 'kovan' ? 'kovan' : 'mainnet',
  voteTxHash: vote.txHash
});

export default connect(
  reduxProps,
  { modalClose, initiateLink, sendMkrToProxy, sendVote }
)(Modal);
