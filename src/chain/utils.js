import contractInfo from './contract-info.json';

export const getLinkGas = () => contractInfo.proxy_factory.total_link_gas;
