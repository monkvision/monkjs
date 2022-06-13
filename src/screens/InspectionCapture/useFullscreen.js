import { useCallback, useState } from 'react';

const runFullscreen = (state) => {
  document.fullscreenEnabled = document.fullscreenEnabled
     || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

  function requestFullscreen(element) {
    if (document.fullscreenElement) { document.exitFullscreen(); state.toggleOff(); return; }

    if (element.requestFullscreen) {
      element.requestFullscreen();
      state.toggleOn();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
      state.toggleOn();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      state.toggleOn();
    }
  }

  if (document.fullscreenEnabled) {
    requestFullscreen(document.documentElement);
  }
};

export default function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleOn = useCallback(() => setIsFullscreen(true), []);
  const toggleOff = useCallback(() => setIsFullscreen(false), []);

  const requestFullscreen = useCallback(() => runFullscreen({ toggleOn, toggleOff }), []);

  return { isFullscreen, requestFullscreen };
}
