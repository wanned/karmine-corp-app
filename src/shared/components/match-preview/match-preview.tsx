import React from 'react';

import { MatchPreviewCompact } from './components/match-preview-compact';
import { MatchPreviewNormal } from './components/match-preview-normal';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export interface MatchPreviewProps {
  match: CoreData.Match;
}

export const MatchPreview = React.memo(
  ({ variant, ...props }: MatchPreviewProps & { variant: 'compact' | 'normal' }) => {
    if (variant === 'compact') {
      return <MatchPreviewCompact {...props} />;
    }

    if (variant === 'normal') {
      return <MatchPreviewNormal {...props} />;
    }

    return null;
  }
);
