import React from 'react';
import router from './router';
import trackPageView from './common/trackPageView';

const app = document.getElementById('app');

router.run((Handler, state) => {
  React.render(<Handler />, app);
  trackPageView(state);
});
