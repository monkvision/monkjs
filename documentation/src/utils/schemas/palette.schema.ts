import { z } from 'zod';

export const AccentColorVariantsSchema = z.object({
  xdark: z.string(),
  dark: z.string(),
  base: z.string(),
  light: z.string(),
  xlight: z.string(),
});

export const TextColorVariantsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  disabled: z.string(),
  white: z.string(),
  black: z.string(),
  link: z.string(),
  linkInverted: z.string(),
});

export const BackgroundColorVariantsSchema = z.object({
  dark: z.string(),
  base: z.string(),
  light: z.string(),
});

export const SurfaceColorVariantsSchema = z.object({
  dark: z.string(),
  light: z.string(),
});

export const OutlineColorVariantsSchema = z.object({
  base: z.string(),
});

export const MonkPaletteSchema = z.object({
  primary: AccentColorVariantsSchema,
  secondary: AccentColorVariantsSchema,
  alert: AccentColorVariantsSchema,
  caution: AccentColorVariantsSchema,
  success: AccentColorVariantsSchema,
  information: AccentColorVariantsSchema,
  text: TextColorVariantsSchema,
  background: BackgroundColorVariantsSchema,
  surface: SurfaceColorVariantsSchema,
  outline: OutlineColorVariantsSchema,
});
