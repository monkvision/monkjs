import { Button } from '@monkvision/common-ui-web';

export interface DoneButtonProps {
  children: string;
}

export function DoneButton({ children }: DoneButtonProps) {
  return <Button>{children}</Button>;
}
