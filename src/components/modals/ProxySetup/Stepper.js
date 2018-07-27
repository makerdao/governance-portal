import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

const StepWrapper = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
`;

const green = ({ active, theme }) =>
  active ? theme.text.green : theme.text.dim_green;

const Title = styled.p`
  font-size: 14px;
  color: ${green};
`;

const Dot = styled.div`
  background-color: ${green};
  height: 10px;
  width: 10px;
  border-radius: 10px;
  margin: 8px auto 0;
  position: relative;
`;

const Line = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${green};
  position: absolute;
  bottom: 4px;
  left: -50%;
`;

const Step = ({ active, title, line, zIndex }) => (
  <StepWrapper active={active} style={{ zIndex }}>
    <Title active={active}>{title}</Title>
    <Dot active={active} />
    {line && <Line active={active} />}
  </StepWrapper>
);

const Stepper = ({ progress }) =>
  progress !== 0 ? (
    <Wrapper>
      <Step active={progress >= 1} title="LINK WALLETS" zIndex={2} />
      <Step active={progress >= 2} title="LOCK MKR" line zIndex={1} />
      <Step active={progress >= 3} title="CONFIRMATION" line />
    </Wrapper>
  ) : null;

export const progressMap = new Proxy(
  {
    intro: 0,
    link: 1,
    initiate: 1,
    approve: 1,
    lockInput: 2,
    lock: 2,
    summary: 3
  },
  {
    get(target, name) {
      if (name === null || name === undefined || !target.hasOwnProperty(name))
        return 1;
      else return target[name];
    }
  }
);

export default Stepper;
