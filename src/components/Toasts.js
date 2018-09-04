import React from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';

import { Toasts as ToastTypes } from '../utils/constants';

export const Container = styled.div`
  position: fixed;
  top: 12px;
  right: 0;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 256px;
  background: transparent;
  pointer-events: none;
  z-index: 10000000000;
`;

const toastFade = keyframes`
  0% {
    opacity: 0;
    top: 8px;
  }
  5% {
    opacity: 1;
    top: 0;
  }
  95% {
    opacity: 1;
    top: 0;
  }
  100% {
    opacity: 0;
    top: -4px;
  }
`;

const Toast = styled.div`
  z-index: 10000000000;
  border-radius: 4px;
  padding: 8px 12px;
  color: #fff;
  font-size: ${({ theme }) => theme.fonts.size.medium};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  line-height: 1.4;
  display: block;
  margin-bottom: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  position: relative;
  animation-duration: 4s;
  animation-fill-mode: forwards;
  animation-name: ${toastFade};
  animation-timing-function: linear;
`;

export const ErrorToast = styled(Toast)`
  background-color: ${({ theme }) => theme.warn.default};
  word-wrap: break-word;
  background-image: ${({ theme }) =>
    `radial-gradient(ellipse farthest-corner at top left, ${
      theme.warn.alt
    } 0%, ${theme.warn.default} 100%)`};
`;

export const SuccessToast = styled(Toast)`
  background-color: green;
`;

export const NeutralToast = styled(Toast)`
  background-color: black;
`;

const Toasts = ({ toasts }) => {
  if (!toasts) return <span />;
  return (
    <Container>
      {toasts.map(toast => {
        const { type, message, id } = toast;
        switch (type) {
          case ToastTypes.ERROR: {
            return <ErrorToast key={id}>{message}</ErrorToast>;
          }
          case ToastTypes.SUCCSSS: {
            return <SuccessToast key={id}>{message}</SuccessToast>;
          }
          case ToastTypes.NEUTRAL: {
            return <NeutralToast key={id}>{message}</NeutralToast>;
          }
          default: {
            return <span />;
          }
        }
      })}
    </Container>
  );
};

export default connect(({ toasts }) => ({ toasts }))(Toasts);
