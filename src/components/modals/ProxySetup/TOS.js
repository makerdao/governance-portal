import React, { Fragment } from 'react';
import styled from 'styled-components';

import {
  StyledTop,
  StyledTitle,
  StyledBlurb,
  FlexRowEnd,
  Skip,
  EndButton
} from '../shared/styles';

const LegalContent = styled.div`
  align-self: center;
  overflow: scroll;
  width: 480px;
  height: 312px;
  font-size: 15px;
  color: #48495f;
  padding-right: 22px;
`;

const TOS = ({ nextStep, modalClose }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Terms of Service</StyledTitle>
    </StyledTop>
    <StyledBlurb style={{ textAlign: 'center' }}>
      To vote in Maker governance, you'll need to agree to the Terms of Service
      below.
    </StyledBlurb>
    <LegalContent>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in diam
      bibendum, lobortis nunc quis, faucibus augue. Quisque ac turpis libero.
      Nam et gravida felis, vel fermentum mauris. Vivamus nec porttitor magna.
      Phasellus leo quam, ultrices nec augue eget, faucibus efficitur est. Donec
      elit est, iaculis sed facilisis eu, placerat vitae odio. Curabitur vitae
      commodo ipsum. Curabitur consectetur ac nibh sit amet iaculis. Sed quis
      massa vel tortor egestas lacinia et vitae orci. Morbi tincidunt lectus
      odio, non fermentum justo laoreet non. Phasellus ac ullamcorper arcu. Sed
      euismod, mauris ac aliquam tristique, nunc diam blandit nunc, id sodales
      lacus velit imperdiet urna. In eu lacinia nibh. Ut ultrices faucibus diam
      et lacinia. Aenean quam neque, ornare tincidunt mi et, suscipit facilisis
      est. Phasellus quis rhoncus magna, ut pretium lectus. Ut vitae varius
      ipsum. Phasellus nec libero dolor. Donec porttitor eget risus ac suscipit.
      Pellentesque non tempor nibh. Curabitur ac scelerisque neque. Nunc luctus
      aliquet nisl vel pretium. Suspendisse auctor pretium urna, eu molestie
      nisi pharetra vitae. Nulla egestas euismod ligula nec mattis. Fusce eu
      augue sollicitudin ex laoreet aliquet. Sed volutpat libero tellus, in
      vehicula leo gravida et. Quisque quis dolor vitae purus vulputate pretium
      non sit amet diam.
    </LegalContent>
    <FlexRowEnd>
      <Skip
        mr={24}
        mt={24}
        onClick={() => {
          modalClose();
        }}
      >
        Cancel
      </Skip>
      <EndButton
        slim
        onClick={() => {
          nextStep();
        }}
      >
        I agree
      </EndButton>
    </FlexRowEnd>
  </Fragment>
);

export default TOS;
