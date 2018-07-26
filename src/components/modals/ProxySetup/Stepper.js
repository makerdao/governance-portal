import React from 'react';

import {
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

export const progressMap = new Proxy(
  {
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
