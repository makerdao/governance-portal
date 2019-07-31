import mixpanel from 'mixpanel-browser';

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test';
const config = {
  test: {
    mixpanel: {
      token: '4ff3f85397ffc3c6b6f0d4120a4ea40a',
      config: { debug: true, ip: false }
    }
  },
  prod: {
    mixpanel: {
      token: 'a030d8845e34bfdc11be3d9f3054ad67',
      config: { ip: false }
    }
  }
}[env];

export const mixpanelInit = () => {
  console.debug(
    `[Mixpanel] Tracking initialized for ${env} env using ${
      config.mixpanel.token
    }`
  );
  mixpanel.init(config.mixpanel.token, config.mixpanel.config);
  mixpanel.track('Pageview', { product: 'governance-dashboard' });
};

export const mixpanelIdentify = (id, props = null) => {
  if (typeof mixpanel.config === 'undefined') return;
  console.debug(
    `[Mixpanel] Identifying as ${id} ${
      props && props.wallet ? `using wallet ${props.wallet}` : ''
    }`
  );
  mixpanel.identify(id);
  if (props) mixpanel.people.set(props);
};
