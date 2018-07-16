import styled from "styled-components";
import React from "react";
import theme from "../theme";

const Spacer = styled.span`
  margin: 0 0.8em;
  color: ${theme.text.dark_default};
`;

export default () => <Spacer>•</Spacer>;
