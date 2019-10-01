import React from 'react';
import { Button, Flex } from '@makerdao/ui-components-core';

const ScreenFooter = ({
  onNext,
  onBack,
  loading,
  canGoBack = true,
  canProgress = true,
  continueText,
  secondaryButtonText
} = {}) => {
  return (
    <Flex textAlign="center" justifyContent="center">
      <Button
        disabled={!canGoBack}
        width="110px"
        variant="secondary-outline"
        mx="xs"
        onClick={onBack}
      >
        {secondaryButtonText ? secondaryButtonText : 'Back'}
      </Button>
      <Button
        disabled={!canProgress}
        loading={loading}
        width="145px"
        mx="xs"
        onClick={onNext}
      >
        {continueText ? continueText : 'Continue'}
      </Button>
    </Flex>
  );
};

export default ScreenFooter;
