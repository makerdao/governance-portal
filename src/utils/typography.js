import styled from 'styled-components';
import { Text } from '@makerdao/ui-components-core';

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

export const Label = styled(Text).attrs({
  fontSize: '1.4rem',
  fontWeight: 'medium',
  color: 'heading'
})``;

export const DataLabel = styled(Text).attrs({
  color: 'grey',
  fontSize: '1rem',
  fontWeight: 'bold'
})``;

export const SubtitleDataLabel = styled(Text).attrs({
  fontSize: '1rem',
  color: 'grey'
})``;

export const BreakableText = styled(Text)`
  overflow-wrap: break-word;
  word-break: break-word;
`;
