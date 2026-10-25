import React, { useEffect } from 'react';
import { NotFoundState } from '../components/common/NotFoundState';
import { PageTransition } from '../components/motion/PageTransition';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page not found | ChargeNearby';
  }, []);

  return (
    <PageTransition>
      <NotFoundState
        title="Looks like you've run out of charge"
        description="The page you're looking for doesn't exist or has moved."
        code="404"
        showRadar={true}
        primaryAction={{ label: 'Back to home', to: '/' }}
        secondaryAction={{ label: 'Find chargers near me', to: '/find' }}
      />
    </PageTransition>
  );
};

export default NotFoundPage;
