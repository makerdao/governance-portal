import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const Wrapper = styled.div`
  border: 1px solid #d1d8da;
  padding: 10px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  color: ${theme.text.dim_grey_alt};
  border: 0;
  padding: 0;
  font-size: 16px;
  flex-grow: 1;
`;

const ButtonWrapper = styled.div`
  margin-left: 16px;
`;

export default ({ button, ...otherProps }) => {
  return (
    <Wrapper>
      <Input {...otherProps} />
      {button && <ButtonWrapper>{button}</ButtonWrapper>}
    </Wrapper>
  );
};
