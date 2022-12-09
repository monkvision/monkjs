import exportVersions from './utils/exportVersions';

exportVersions();

export { default as Camera } from './components/Camera';
export { default as Capture } from './components/Capture';
export { default as Controls } from './components/Controls';
export { default as Layout } from './components/Layout';
export { default as Overlay } from './components/Overlay';
export { default as Sights } from './components/Sights';
export { default as Thumbnail } from './components/Thumbnail';
export { default as UploadCenter } from './components/UploadCenter';

export { default as useMobileBrowserConfig } from './hooks/useMobileBrowserConfig';
export { default as useOrientation } from './hooks/useOrientation';
export { default as usePermissions } from './hooks/usePermissions';
export { default as useSettings } from './hooks/useSettings';
export { default as useSights } from './hooks/useSights';
export { default as useToggle } from './hooks/useToggle';
export { default as useUploads } from './hooks/useUploads';
export { default as useCompliance } from './hooks/useCompliance';

export { default as Actions } from './actions';
export { default as Constants } from './const';

export { default as i18nCamera } from './i18n';
