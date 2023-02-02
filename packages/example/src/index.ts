import { Example } from './example';

export const myExample: Example = {
  helloWorld: () => {
    const message = 'Hello world !';
    console.log(message);
    return message;
  },
};
