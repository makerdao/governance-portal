import TestChainService from './TestChainService';

const nonAsyncFunc = async input => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  console.log('res', res);
  const json = await res.json();

  return 'Hello ' + input;
};
// const testId = nonAsyncFunc('tu');

// export default {
//   addConfig: async () => ({
//     additionalServices: ['testchain'],
//     testchain: TestChainService,
//     nonAsyncFunc: testId
//   })
// };

export default async function(testId) {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const json = await res.json();
  console.log('json', json);
  json.thing = { thing1: testId, thing2: 'th2' };
  json.log = true;

  return json;
  // try {
  //   console.log('RES IN PLUGIN', res);
  //   const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  //   console.log('something');
  //   console.log('RES IN PLUGIN', res);
  //   // return await res.json();
  // } catch (err) {
  //   console.log('error)', err);
  // }

  // const fetchAsyncThing = () => {
  //   const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  //   console.log('RES IN PLUGIN', res);
  //   return await res.json();
  // };
  // await fetchAsyncThing();
}
