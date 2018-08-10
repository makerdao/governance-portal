import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { modalClose } from '../../reducers/modal';
import Card from '../Card';
import { colors, responsive } from '../../theme';

const Column = styled.div`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? '100%' : 'auto')};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  padding-top: 10vh;
  padding-bottom: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
`;

const LightBox = styled.div`
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  transition: ${({ theme }) => theme.transitions.base};
  opacity: ${({ modal }) => (modal ? 1 : 0)};
  visibility: ${({ modal }) => (modal ? 'visible' : 'hidden')};
  pointer-events: ${({ modal }) => (modal ? 'auto' : 'none')};
  background: rgba(${colors.dark}, 0.2);
`;

const Hitbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ModalCard = Card.extend`
  padding: 30px 26px;
  display: flex;
  flex-direction: column;
  @media screen and (${responsive.sm.max}) {
    padding: 15px;
    & h4 {
      margin: 20px auto;
    }
  }
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

const Modal = props => {
  const body = document.body || document.getElementsByTagName('body')[0];
  const { modal: ModalClass, open, modalClose, ...otherProps } = props;
  body.style.overflow = open ? 'hidden' : 'auto';

  return (
    <LightBox modal={open}>
      <Hitbox onClick={modalClose} />
      <Column maxWidth={600}>
        <ModalCard background="white">
          <CloseButton onClick={modalClose} />
          <ModalClass {...otherProps} />
        </ModalCard>
      </Column>
    </LightBox>
  );
};

export default connect(
  state => ({ ...state.modal }),
  { modalClose }
)(Modal);
