import { MonkPalette } from '@monkvision/types';

export interface GetColorInput {
  name: string;
  variant: string;
}

export function getInputName(input: GetColorInput): string {
  return `${input.name}-${input.variant}`;
}

export function getExpectedOutput(palette: MonkPalette, input: GetColorInput): string {
  return palette[input.name as keyof MonkPalette][
    input.variant as keyof MonkPalette[keyof MonkPalette]
  ];
}

export const accentColorVariants = ['xdark', 'dark', 'base', 'light', 'xlight'];
export const accentColorNames = [
  'primary',
  'secondary',
  'alert',
  'caution',
  'success',
  'information',
  'grey',
];
export const textColorVariants = ['primary', 'secondary', 'tertiary', 'disable', 'white'];
export const textLinkColorVariants = ['onLight', 'onDark'];
export const backgroundColorVariants = ['dark', 'base', 'light', 'white'];
export const surfaceColorVariants = ['bg', 's1', 's2', 's3', 's4', 's5'];
export const borderColorVariants = ['base'];
export const outlineColorVariants = ['base'];

const inputs: GetColorInput[] = [];
accentColorNames.forEach((name) =>
  accentColorVariants.forEach((variant) => inputs.push({ name, variant })),
);
textColorVariants.forEach((variant) => inputs.push({ name: 'text', variant }));
textLinkColorVariants.forEach((variant) => inputs.push({ name: 'textLink', variant }));
backgroundColorVariants.forEach((variant) => inputs.push({ name: 'background', variant }));
surfaceColorVariants.forEach((variant) => inputs.push({ name: 'surface', variant }));
borderColorVariants.forEach((variant) => inputs.push({ name: 'border', variant }));
outlineColorVariants.forEach((variant) => inputs.push({ name: 'outline', variant }));

export { inputs };
