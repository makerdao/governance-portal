import styled from 'styled-components';

const Step = styled.div`
  opacity: 0;
  position: absolute;
  pointer-events: none;

  ${props =>
    props.active &&
    `
    pointer-events: unset;
    position: relative;
    transition: opacity 0.6s;
    opacity: 1;
  `};
`;

export default Step;
