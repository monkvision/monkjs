import isEmpty from 'functions/isEmpty';

/**
 * Take an email and replace it by a string partially hidden.
 * @param email {string}
 * @returns {string}
 */
export default function partiallyHideEmail(email) {
  if (isEmpty(email)) {
    throw Error('email (1) argument is required in privatizeEmail function');
  }

  return email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1***@$2');
}
