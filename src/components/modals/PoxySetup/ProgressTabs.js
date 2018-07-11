import React from "react";

import {
  CircledNum,
  ProgressTabsWrapper,
  TabsTitle,
  TabsTitleWrapper
} from "./style";

const ProgressTabs = ({ progress }) => (
  <ProgressTabsWrapper>
    <TabsTitleWrapper borderRight>
      <CircledNum dim={progress <= 0} p={-1} fontSize={14} size={22}>
        1
      </CircledNum>
      <TabsTitle>Link Wallets</TabsTitle>
    </TabsTitleWrapper>
    <TabsTitleWrapper borderRight>
      <CircledNum dim={progress <= 1} p={-1} fontSize={14} size={22}>
        2
      </CircledNum>
      <TabsTitle>Lock MKR</TabsTitle>
    </TabsTitleWrapper>
    <TabsTitleWrapper>
      <CircledNum dim={progress <= 2} p={-1} fontSize={14} size={22}>
        3
      </CircledNum>
      <TabsTitle>Finished</TabsTitle>
    </TabsTitleWrapper>
  </ProgressTabsWrapper>
);

export default ProgressTabs;
