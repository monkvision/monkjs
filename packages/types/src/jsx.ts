import { CSSProperties, JSX } from 'react';
import { Color } from './theme';

/**
 * Subtype of React's `JSX.IntrinsicElements` containing only the SVG tags. This type is used when we need to enforce
 * tag names to SVG tags only in React components.
 */
export type JSXIntrinsicSVGElements = Pick<
  JSX.IntrinsicElements,
  | 'svg'
  | 'animate'
  | 'animateMotion'
  | 'animateTransform'
  | 'circle'
  | 'clipPath'
  | 'defs'
  | 'desc'
  | 'ellipse'
  | 'feBlend'
  | 'feColorMatrix'
  | 'feComponentTransfer'
  | 'feComposite'
  | 'feConvolveMatrix'
  | 'feDiffuseLighting'
  | 'feDisplacementMap'
  | 'feDistantLight'
  | 'feDropShadow'
  | 'feFlood'
  | 'feFuncA'
  | 'feFuncB'
  | 'feFuncG'
  | 'feFuncR'
  | 'feGaussianBlur'
  | 'feImage'
  | 'feMerge'
  | 'feMergeNode'
  | 'feMorphology'
  | 'feOffset'
  | 'fePointLight'
  | 'feSpecularLighting'
  | 'feSpotLight'
  | 'feTile'
  | 'feTurbulence'
  | 'filter'
  | 'foreignObject'
  | 'g'
  | 'image'
  | 'line'
  | 'linearGradient'
  | 'marker'
  | 'mask'
  | 'metadata'
  | 'mpath'
  | 'path'
  | 'pattern'
  | 'polygon'
  | 'polyline'
  | 'radialGradient'
  | 'rect'
  | 'stop'
  | 'switch'
  | 'symbol'
  | 'text'
  | 'textPath'
  | 'tspan'
  | 'use'
  | 'view'
>;

/**
 * Media query that can be included with a component style to make it responsive.
 */
export interface CSSMediaQuery {
  /**
   * Use this property to apply the given style only when the window width is smaller than the specified value.
   */
  maxWidth?: number;
  /**
   * Use this property to apply the given style only when the window width is bigger than the specified value.
   */
  minWidth?: number;
  /**
   * Use this property to apply the given style only when the window height is smaller than the specified value.
   */
  maxHeight?: number;
  /**
   * Use this property to apply the given style only when the window height is bigger than the specified value.
   */
  minHeight?: number;
  /**
   * Use this property to apply the given style only when the window is in portrait mode.
   */
  portrait?: boolean;
  /**
   * Use this property to apply the given style only when the window is in landscape mode.
   */
  landscape?: boolean;
}

/**
 * An extension of React's CSSProperties type that includes an optional media query to make the style responsive.
 */
export interface ResponsiveStyleProperties extends CSSProperties {
  /**
   * An optional media query that, if used with the proper logic, will condition the display of this style.
   */
  __media?: CSSMediaQuery;
}

/**
 * Record containing CSS inline styles that can be passed to the `style` prop in React.
 */
export type Styles = Record<string, ResponsiveStyleProperties>;

/**
 * The status of an interactive DOM element.
 */
export enum InteractiveStatus {
  /**
   * The default status of the element.
   */
  DEFAULT = 'default',
  /**
   * The element is being hovered by the user (and neither active nor disabled).
   */
  HOVERED = 'hovered',
  /**
   * The element is active (and not disabled).
   */
  ACTIVE = 'active',
  /**
   * The element is disabled.
   */
  DISABLED = 'disabled',
}

/**
 * A set of colors used to tint or shade a React element based on its interactive status.
 */
export type InteractiveColors = Record<InteractiveStatus, Color>;
