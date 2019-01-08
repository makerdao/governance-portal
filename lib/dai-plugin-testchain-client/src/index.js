import fetchConfig from './fetchConfig';

export default {
  beforeCreate: async function(testchainId) {
    const config = await fetchConfig(testchainId);
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    // const res = await fetch('http://localhost:4000');
    const json = await res.json();
    console.log('res from TaaS api (gov)', json);
    return Object.assign(config, json);
  }
};

// export default async function(testId) {
//   const config = await fetchConfig(testId);
//   const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
//   // const res = await fetch('http://localhost:4000');
//   const json = await res.json();
//   console.log('resposne from TaaS api', json);
//   return config;
// }
