import { Icon, IconName } from '@monkvision/common-ui-web';
import { styles, usePageLayoutItemStyles } from './PageLayoutItem.styles';

/**
 * Props accepted by the PageLayoutItem component.
 */
export interface PageLayoutItemProps {
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
export function PageLayoutItem({ icon, title, description }: PageLayoutItemProps) {
  const { iconProps, titleStyle, descriptionStyle } = usePageLayoutItemStyles();

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
