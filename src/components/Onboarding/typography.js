import styled from 'styled-components';
import { Box } from '@makerdao/ui-components';

// here only very temporarily as we standardize typography in the styleguide
export const H1 = styled.h1`
  font-weight: normal;
  font-size: 4rem;
`;

export const H2 = styled.h2`
  font-weight: 500;
  font-size: 3.2rem;
  letter-spacing: 0.03rem;
`;

export const H3 = styled.h3`
  font-size: 2rem;
`;

export const Label = styled(Box).attrs({
  fontSize: '1.4rem',
  fontWeight: 'medium',
  color: 'heading'
})``;

export const DataLabel = styled(Box).attrs({
  color: 'grey',
  fontSize: '1rem',
  fontWeight: 'bold'
})``;
