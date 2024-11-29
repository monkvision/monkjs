import { Styles } from '@monkvision/types';
import { fullyColorSVG, useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { DynamicSVGProps, IconProps } from '@monkvision/common-ui-web';
import { CSSProperties, useCallback } from 'react';

export const styles: Styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    margin: '32px 0',
    width: 80,
    height: 'auto',
  },
  logoSmall: {
    __media: {
      maxHeight: 500,
    },
    margin: '16px 0',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    textAlign: 'center',
    padding: '0 32px 16px 32px',
  },
  titleSmall: {
    __media: {
      maxHeight: 500,
    },
    fontSize: 24,
    fontWeight: 700,
    textAlign: 'center',
    padding: '0 16px 10px 16px',
  },
  permissionsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
  permission: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  permissionIcon: {
    marginRight: 12,
  },
  permissionLabels: {
    flex: 1,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 500,
  },
  permissionTitleSmall: {
    __media: {
      maxHeight: 500,
    },
    fontSize: 16,
    fontWeight: 500,
  },
  permissionDescription: {
    fontSize: 18,
    paddingTop: 6,
    opacity: 0.91,
    fontWeight: 300,
  },
  permissionDescriptionSmall: {
    __media: {
      maxHeight: 500,
    },
    fontSize: 14,
    fontWeight: 500,
  },
  confirmContainer: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 32px 32px 32px',
  },
  confirmButton: {
    alignSelf: 'stretch',
    maxWidth: 300,
  },
};

interface VideoCapturePermissionsStyle {
  logoProps: Partial<DynamicSVGProps>;
  permissionIconProps: Partial<IconProps>;
  titleStyle: CSSProperties;
  permissionTitleStyle: CSSProperties;
  permissionDescriptionStyle: CSSProperties;
}

export function useVideoCapturePermissionsStyles(): VideoCapturePermissionsStyle {
  const { palette } = useMonkTheme();
  const { responsive } = useResponsiveStyle();

  const getLogoAttributes = useCallback(
    (element: Element) => fullyColorSVG(element, palette.text.primary),
    [palette],
  );

  return {
    logoProps: {
      getAttributes: getLogoAttributes,
      style: {
        ...styles['logo'],
        ...responsive(styles['logoSmall']),
      },
    },
    permissionIconProps: {
      size: 40,
      primaryColor: palette.primary.base,
    },
    titleStyle: {
      ...styles['title'],
      ...responsive(styles['titleSmall']),
    },
    permissionTitleStyle: {
      ...styles['permissionTitle'],
      ...responsive(styles['permissionTitleSmall']),
    },
    permissionDescriptionStyle: {
      ...styles['permissionDescription'],
      ...responsive(styles['permissionDescriptionSmall']),
    },
  };
}
