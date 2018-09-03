import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { modalClose } from '../../reducers/modal';
import Card from '../Card';
import { colors, responsive } from '../../theme';

const fallDownIn = keyframes`
0% {
  opacity: 0;
  transform: translateY(-15px);
}
100% {
  opacity: 1;
  transform: translateY(0);
}
`;

const fallDownOut = keyframes`
0% {
  opacity: 1;
  transform: translateY(0px);
}
100% {
  opacity: 0;
  transform: translateY(15px);
}
`;

const Column = styled.div`
  ${({ modal }) =>
    modal
      ? `animation: ${fallDownIn} 0.4s forwards;`
      : `animation: ${fallDownOut} 0.4s forwards;`};
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
  transition: ${({ theme }) => theme.transitions.x_long};
  opacity: ${({ modal }) => (modal ? 1 : 0)};
  visibility: ${({ modal }) => (modal ? 'visible' : 'hidden')};
  pointer-events: ${({ modal }) => (modal ? 'auto' : 'none')};
  background: rgba(${colors.dark}, 0.2);
`;

const Hitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ModalCard = Card.extend`
  overflow: visible;
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
  font-family: tahoma;
  line-height: 21px;
  height: 28px;
  width: 28px;
  border-radius: 28px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.2);
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  font-size: 22px;
  text-align: center;
`;

const Modal = props => {
  const { modal: ModalClass, visible, modalClose, ...otherProps } = props;
  if (!ModalClass) return null;

  const body = document.body || document.getElementsByTagName('body')[0];
  body.style.overflow = visible ? 'hidden' : 'auto';

  return (
    <LightBox modal={visible}>
      <Hitbox onClick={modalClose} />
      <Column maxWidth={600} modal={visible}>
        <ModalCard background="white">
          <CloseButton onClick={modalClose} />
          {ModalClass && <ModalClass {...otherProps} />}
        </ModalCard>
      </Column>
    </LightBox>
  );
};

export default connect(
  state => state.modal.stack[0] || {},
  { modalClose }
)(Modal);
