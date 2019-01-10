import styled from 'styled-components';
import { Link } from '@makerdao/ui-components';

import newTab from '../../../imgs/onboarding/newtab.svg';

const ExternalLink = styled(Link)`
  position: relative;
  &:after {
    margin-left: 0.5rem;
    content: '';
    position: absolute;
    top: calc(50% - 4px);
    bottom: 0;
    mask: url(${newTab}) no-repeat center center;
    height: 8px;
    width: 8px;
    background-color: currentColor;
  }
`;

export default ExternalLink;
