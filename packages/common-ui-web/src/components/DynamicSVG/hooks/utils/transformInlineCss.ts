import { toCamelCase, capitalize } from '@monkvision/common';
import { CssTypes, parse as cssParse } from '@adobe/css-tools';
import type { CssAtRuleAST, CssDeclarationAST, CssRuleAST } from '@adobe/css-tools';
import { CSSProperties } from 'react';

function isRegularRule(rule: CssAtRuleAST | undefined): rule is CssRuleAST {
  return rule?.type === CssTypes.rule;
}

function isDeclaration(
  declaration: CssRuleAST['declarations'][number],
): declaration is CssDeclarationAST {
  return declaration.type === CssTypes.declaration;
}

function transformCssDeclaration(declaration: CssRuleAST['declarations'][number]): CSSProperties {
  if (!isDeclaration(declaration) || !declaration.property || !declaration.value) {
    return {};
  }
  let declarationKey = toCamelCase(declaration.property);
  if (declaration.property.startsWith('-') && !declaration.property.startsWith('-ms')) {
    declarationKey = capitalize(declarationKey);
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
