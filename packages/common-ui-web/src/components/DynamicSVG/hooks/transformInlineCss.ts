import { toCamelCase, uncapitalize } from '@monkvision/common';
import type { AtRule, Comment, Declaration, Rule } from 'css';
import cssParse from 'css/lib/parse';
import { CSSProperties } from 'react';

type CSSRule = Rule | Comment | AtRule;

function isRegularRule(rule: CSSRule): rule is Rule {
  return rule.type === 'rule';
}

function isDeclaration(declaration: Comment | Declaration): declaration is Declaration {
  return declaration.type === 'declaration';
}

function transformCssDeclaration(declaration: Declaration | Comment): CSSProperties {
  if (!isDeclaration(declaration) || !declaration.property || !declaration.value) {
    return {};
  }
  let declarationKey = toCamelCase(declaration.property);
  if (declaration.property.startsWith('-ms')) {
    declarationKey = uncapitalize(declarationKey);
  }
  return { [declarationKey]: declaration.value };
}

function wrapInlineCssWithClass(inlineCss: string, wrapperClass: string): string {
  return `.${wrapperClass} { ${inlineCss} }`;
}

/**
 * This function is used to transform inline CSS style strings into React inline style objects.
 *
 * @example
 * transformInlineCss('background-color: red; width: 200px');
 * // Returns : { backgroundColor: 'red', width: '200px' }
 */
export function transformInlineCss(inlineCss: string | null | undefined): CSSProperties {
  if (!inlineCss) {
    return {};
  }

  const wrapperClass = 'wrapper';
  const parsedCss = cssParse(wrapInlineCssWithClass(inlineCss, wrapperClass));

  if (!parsedCss.stylesheet || !isRegularRule(parsedCss.stylesheet.rules[0])) {
    throw new Error(`Unable to parse inline CSS style : ${inlineCss}`);
  }
  return (parsedCss.stylesheet.rules[0].declarations ?? []).reduce(
    (prev, curr) => ({
      ...prev,
      ...transformCssDeclaration(curr),
    }),
    {} as CSSProperties,
  );
}
