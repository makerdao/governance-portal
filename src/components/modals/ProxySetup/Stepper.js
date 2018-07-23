import React from 'react';

import {
  CircledNum,
  ProgressTabsWrapper,
  TabsTitle,
  TabsTitleWrapper
} from '../shared/styles';

const Stepper = ({ progress }) => (
  <ProgressTabsWrapper>
    <TabsTitleWrapper active={progress >= 1}>
      <TabsTitle>LINK WALLETS</TabsTitle>
    </TabsTitleWrapper>
    <TabsTitleWrapper active={progress >= 2}>
      <TabsTitle>LOCK MKR</TabsTitle>
    </TabsTitleWrapper>
    <TabsTitleWrapper active={progress >= 3}>
      <TabsTitle>CONFIRMATION</TabsTitle>
    </TabsTitleWrapper>
  </ProgressTabsWrapper>
);

export default Stepper;
