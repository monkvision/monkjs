import { Icon, IconName } from '@monkvision/common-ui-web';
import { styles, useIntroLayoutItemStyles } from './IntroLayoutItem.styles';

/**
 * Props accepted by the IntroLayoutItem component.
 */
export interface IntroLayoutItemProps {
  /**
   * The name of the item icon.
   */
  icon: IconName;
  /**
   * The title of the item.
   */
  title: string;
  /**
   * The description of the item.
   */
  description: string;
}

/**
 * A custom list item that is displayed in VideoCapture Intro screens.
 */
export function IntroLayoutItem({ icon, title, description }: IntroLayoutItemProps) {
  const { iconProps, titleStyle, descriptionStyle } = useIntroLayoutItemStyles();

  return (
    <div style={styles['container']}>
      <Icon icon={icon} {...iconProps} />
      <div style={styles['labels']}>
        <div style={titleStyle}>{title}</div>
        <div style={descriptionStyle}>{description}</div>
      </div>
    </div>
  );
}
