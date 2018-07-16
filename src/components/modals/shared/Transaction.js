import React, { Fragment } from "react";
import { ethScanLink } from "../../../utils/ethereum";

import { StyledTitle, StyledTop, TxHash } from "./styles";
import Button from "../../Button";

const Transaction = ({ txHash, nextStep, network }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Transaction Hash</StyledTitle>
    </StyledTop>
    <TxHash href={ethScanLink(txHash, network)} target="_blank">
      {txHash}
    </TxHash>
    <div
      style={{
        alignSelf: "center",
        marginTop: "18px"
      }}
    >
      <Button slim onClick={nextStep}>
        Continue
      </Button>
    </div>
  </Fragment>
);

export default Transaction;
