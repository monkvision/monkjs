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
];
export const textColorVariants = [
  'primary',
  'secondary',
  'disabled',
  'white',
  'black',
  'link',
  'linkInverted',
];
export const backgroundColorVariants = ['dark', 'base', 'light'];
export const surfaceColorVariants = ['dark', 'light'];
export const outlineColorVariants = ['base'];

const inputs: GetColorInput[] = [];
accentColorNames.forEach((name) =>
  accentColorVariants.forEach((variant) => inputs.push({ name, variant })),
);
textColorVariants.forEach((variant) => inputs.push({ name: 'text', variant }));
backgroundColorVariants.forEach((variant) => inputs.push({ name: 'background', variant }));
surfaceColorVariants.forEach((variant) => inputs.push({ name: 'surface', variant }));
outlineColorVariants.forEach((variant) => inputs.push({ name: 'outline', variant }));

export { inputs };
