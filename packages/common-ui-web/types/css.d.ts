/**
 * We have to declare the type definitions for this module because :
 * - There is a bug in the `css` package that causes a bug when importing the whole library in browsers (because the
 * package uses the Node.Js "fs" package for some random utilities unrelated to the "parse" function, so importing the
 * entire package fails in web since "fs" is not available in browsers.).
 * - In order to bypass this limitation, we need to import *just* the parse function through the 'css/lib/parse'
 * import statement.
 * - However, this import statement does not have any type definitions, se we have to declare them ourselves.
 *
 * References :
 * - https://github.com/reworkcss/css/issues/139
 * - https://github.com/reworkcss/css/pull/146#issuecomment-740412799
 */
declare module 'css/lib/parse' {
  import type { ParserOptions, Stylesheet } from 'css';
  export default function cssParse(code: string, options?: ParserOptions | undefined): Stylesheet;
}
