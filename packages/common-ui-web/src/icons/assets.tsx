import { FunctionComponent, SVGProps } from 'react';
import { IconName } from './names';
import { ReactComponent as Icon360 } from '../assets/icons/360.svg';
import { ReactComponent as IconAccountCircle } from '../assets/icons/account-circle.svg';
import { ReactComponent as IconAcv } from '../assets/icons/acv.svg';
import { ReactComponent as IconAddComment } from '../assets/icons/add-comment.svg';
import { ReactComponent as IconAddImage } from '../assets/icons/add-image.svg';
import { ReactComponent as IconAddPhoto } from '../assets/icons/add-photo.svg';
import { ReactComponent as IconAdd } from '../assets/icons/add.svg';
import { ReactComponent as IconAlignLeft } from '../assets/icons/align-left.svg';
import { ReactComponent as IconAlignRight } from '../assets/icons/align-right.svg';
import { ReactComponent as IconAnnouncement } from '../assets/icons/announcement.svg';
import { ReactComponent as IconArrowBackIos } from '../assets/icons/arrow-back-ios.svg';
import { ReactComponent as IconArrowBack } from '../assets/icons/arrow-back.svg';
import { ReactComponent as IconArrowDown } from '../assets/icons/arrow-down.svg';
import { ReactComponent as IconArrowDropDown } from '../assets/icons/arrow-drop-down.svg';
import { ReactComponent as IconArrowDropUp } from '../assets/icons/arrow-drop-up.svg';
import { ReactComponent as IconArrowForwardIos } from '../assets/icons/arrow-forward-ios.svg';
import { ReactComponent as IconArrowForward } from '../assets/icons/arrow-forward.svg';
import { ReactComponent as IconArrowUp } from '../assets/icons/arrow-up.svg';
import { ReactComponent as IconAttachMoney } from '../assets/icons/attach-money.svg';
import { ReactComponent as IconAutoAwesome } from '../assets/icons/auto-awesome.svg';
import { ReactComponent as IconBarChart } from '../assets/icons/bar-chart.svg';
import { ReactComponent as IconBellGraph } from '../assets/icons/bell-graph.svg';
import { ReactComponent as IconBluetoothSearching } from '../assets/icons/bluetooth-searching.svg';
import { ReactComponent as IconBluetooth } from '../assets/icons/bluetooth.svg';
import { ReactComponent as IconBookmarkOutline } from '../assets/icons/bookmark-outline.svg';
import { ReactComponent as IconBookmark } from '../assets/icons/bookmark.svg';
import { ReactComponent as IconCalendarToday } from '../assets/icons/calendar-today.svg';
import { ReactComponent as IconCalendar } from '../assets/icons/calendar.svg';
import { ReactComponent as IconCameraOff } from '../assets/icons/camera-off.svg';
import { ReactComponent as IconCamera } from '../assets/icons/camera.svg';
import { ReactComponent as IconCancel } from '../assets/icons/cancel.svg';
import { ReactComponent as IconCellularSignalNoConnection } from '../assets/icons/cellular-signal-no-connection.svg';
import { ReactComponent as IconCheckCircleOutline } from '../assets/icons/check-circle-outline.svg';
import { ReactComponent as IconCheckCircle } from '../assets/icons/check-circle.svg';
import { ReactComponent as IconCheck } from '../assets/icons/check.svg';
import { ReactComponent as IconChevronLeft } from '../assets/icons/chevron-left.svg';
import { ReactComponent as IconChevronRight } from '../assets/icons/chevron-right.svg';
import { ReactComponent as IconCircle } from '../assets/icons/circle.svg';
import { ReactComponent as IconClose } from '../assets/icons/close.svg';
import { ReactComponent as IconCloudDownload } from '../assets/icons/cloud-download.svg';
import { ReactComponent as IconCloudUpload } from '../assets/icons/cloud-upload.svg';
import { ReactComponent as IconContentCut } from '../assets/icons/content-cut.svg';
import { ReactComponent as IconConvertible } from '../assets/icons/convertible.svg';
import { ReactComponent as IconCopy } from '../assets/icons/copy.svg';
import { ReactComponent as IconCoupe } from '../assets/icons/coupe.svg';
import { ReactComponent as IconCreditCard } from '../assets/icons/credit-card.svg';
import { ReactComponent as IconCreditScore } from '../assets/icons/credit-score.svg';
import { ReactComponent as IconCrop } from '../assets/icons/crop.svg';
import { ReactComponent as IconCrossover } from '../assets/icons/crossover.svg';
import { ReactComponent as IconDelete } from '../assets/icons/delete.svg';
import { ReactComponent as IconDiamond } from '../assets/icons/diamond.svg';
import { ReactComponent as IconDirectionsCar } from '../assets/icons/directions-car.svg';
import { ReactComponent as IconDoubleArrowDown } from '../assets/icons/double-arrow-down.svg';
import { ReactComponent as IconDoubleArrowRight } from '../assets/icons/double-arrow-right.svg';
import { ReactComponent as IconDoubleArrowUp } from '../assets/icons/double-arrow-up.svg';
import { ReactComponent as IconDragHandle } from '../assets/icons/drag-handle.svg';
import { ReactComponent as IconEdit } from '../assets/icons/edit.svg';
import { ReactComponent as IconEmojiEvents } from '../assets/icons/emoji-events.svg';
import { ReactComponent as IconErrorOutline } from '../assets/icons/error-outline.svg';
import { ReactComponent as IconError } from '../assets/icons/error.svg';
import { ReactComponent as IconExpandLess } from '../assets/icons/expand-less.svg';
import { ReactComponent as IconExpandMore } from '../assets/icons/expand-more.svg';
import { ReactComponent as IconFacebook } from '../assets/icons/facebook.svg';
import { ReactComponent as IconFavoriteOutline } from '../assets/icons/favorite-outline.svg';
import { ReactComponent as IconFavorite } from '../assets/icons/favorite.svg';
import { ReactComponent as IconFileDownload } from '../assets/icons/file-download.svg';
import { ReactComponent as IconFilterList } from '../assets/icons/filter-list.svg';
import { ReactComponent as IconFlashOff } from '../assets/icons/flash-off.svg';
import { ReactComponent as IconFlashlightOff } from '../assets/icons/flashlight-off.svg';
import { ReactComponent as IconFlashlightOn } from '../assets/icons/flashlight-on.svg';
import { ReactComponent as IconFullScreen } from '../assets/icons/full-screen.svg';
import { ReactComponent as IconGavel } from '../assets/icons/gavel.svg';
import { ReactComponent as IconGridOff } from '../assets/icons/grid-off.svg';
import { ReactComponent as IconGridOn } from '../assets/icons/grid-on.svg';
import { ReactComponent as IconGrid } from '../assets/icons/grid.svg';
import { ReactComponent as IconHatchback } from '../assets/icons/hatchback.svg';
import { ReactComponent as IconHelpOutline } from '../assets/icons/help-outline.svg';
import { ReactComponent as IconHelp } from '../assets/icons/help.svg';
import { ReactComponent as IconHistory } from '../assets/icons/history.svg';
import { ReactComponent as IconImage } from '../assets/icons/image.svg';
import { ReactComponent as IconInfo } from '../assets/icons/info.svg';
import { ReactComponent as IconInstagram } from '../assets/icons/instagram.svg';
import { ReactComponent as IconKeyboard } from '../assets/icons/keyboard.svg';
import { ReactComponent as IconLightbulb } from '../assets/icons/lightbulb.svg';
import { ReactComponent as IconLimo } from '../assets/icons/limo.svg';
import { ReactComponent as IconLinkedin } from '../assets/icons/linkedin.svg';
import { ReactComponent as IconLocationOn } from '../assets/icons/location-on.svg';
import { ReactComponent as IconLocation } from '../assets/icons/location.svg';
import { ReactComponent as IconLockOpen } from '../assets/icons/lock-open.svg';
import { ReactComponent as IconLock } from '../assets/icons/lock.svg';
import { ReactComponent as IconMail } from '../assets/icons/mail.svg';
import { ReactComponent as IconMenu } from '../assets/icons/menu.svg';
import { ReactComponent as IconMerge } from '../assets/icons/merge.svg';
import { ReactComponent as IconMic } from '../assets/icons/mic.svg';
import { ReactComponent as IconMinivan } from '../assets/icons/minivan.svg';
import { ReactComponent as IconMoreHorizontal } from '../assets/icons/more-horizontal.svg';
import { ReactComponent as IconMoreVertical } from '../assets/icons/more-vertical.svg';
import { ReactComponent as IconMultilineChart } from '../assets/icons/multiline-chart.svg';
import { ReactComponent as IconNotificationsOutline } from '../assets/icons/notifications-outline.svg';
import { ReactComponent as IconNotifications } from '../assets/icons/notifications.svg';
import { ReactComponent as IconOdometer } from '../assets/icons/odometer.svg';
import { ReactComponent as IconOffRoad } from '../assets/icons/off-road.svg';
import { ReactComponent as IconOfferSent } from '../assets/icons/offer-sent.svg';
import { ReactComponent as IconOpenInNew } from '../assets/icons/open-in-new.svg';
import { ReactComponent as IconPaid } from '../assets/icons/paid.svg';
import { ReactComponent as IconPause } from '../assets/icons/pause.svg';
import { ReactComponent as IconPersonOutline } from '../assets/icons/person-outline.svg';
import { ReactComponent as IconPlayArrow } from '../assets/icons/play-arrow.svg';
import { ReactComponent as IconPodcast } from '../assets/icons/podcast.svg';
import { ReactComponent as IconPriceCheck } from '../assets/icons/price-check.svg';
import { ReactComponent as IconPrint } from '../assets/icons/print.svg';
import { ReactComponent as IconPriorityHigh } from '../assets/icons/priority-high.svg';
import { ReactComponent as IconProgress } from '../assets/icons/progress.svg';
import { ReactComponent as IconPublic } from '../assets/icons/public.svg';
import { ReactComponent as IconQrCodeScanner } from '../assets/icons/qr-code-scanner.svg';
import { ReactComponent as IconRedo } from '../assets/icons/redo.svg';
import { ReactComponent as IconRefresh } from '../assets/icons/refresh.svg';
import { ReactComponent as IconRemoveCircle } from '../assets/icons/remove-circle.svg';
import { ReactComponent as IconRemove } from '../assets/icons/remove.svg';
import { ReactComponent as IconReply } from '../assets/icons/reply.svg';
import { ReactComponent as IconReportProblem } from '../assets/icons/report-problem.svg';
import { ReactComponent as IconRoadster } from '../assets/icons/roadster.svg';
import { ReactComponent as IconRobot } from '../assets/icons/robot.svg';
import { ReactComponent as IconRotate } from '../assets/icons/rotate.svg';
import { ReactComponent as IconScan } from '../assets/icons/scan.svg';
import { ReactComponent as IconSearch } from '../assets/icons/search.svg';
import { ReactComponent as IconSedan } from '../assets/icons/sedan.svg';
import { ReactComponent as IconSelected } from '../assets/icons/selected.svg';
import { ReactComponent as IconSell } from '../assets/icons/sell.svg';
import { ReactComponent as IconSettingsOutline } from '../assets/icons/settings-outline.svg';
import { ReactComponent as IconSettings } from '../assets/icons/settings.svg';
import { ReactComponent as IconShareIos } from '../assets/icons/share-ios.svg';
import { ReactComponent as IconShare } from '../assets/icons/share.svg';
import { ReactComponent as IconShowChart } from '../assets/icons/show-chart.svg';
import { ReactComponent as IconSort } from '../assets/icons/sort.svg';
import { ReactComponent as IconStore } from '../assets/icons/store.svg';
import { ReactComponent as IconSuv } from '../assets/icons/suv.svg';
import { ReactComponent as IconSyncProblem } from '../assets/icons/sync-problem.svg';
import { ReactComponent as IconTextSnippet } from '../assets/icons/text-snippet.svg';
import { ReactComponent as IconTimer } from '../assets/icons/timer.svg';
import { ReactComponent as IconTrendingUp } from '../assets/icons/trending-up.svg';
import { ReactComponent as IconTruck } from '../assets/icons/truck.svg';
import { ReactComponent as IconTune } from '../assets/icons/tune.svg';
import { ReactComponent as IconTwitter } from '../assets/icons/twitter.svg';
import { ReactComponent as IconUndo } from '../assets/icons/undo.svg';
import { ReactComponent as IconUnfoldMore } from '../assets/icons/unfold-more.svg';
import { ReactComponent as IconVan } from '../assets/icons/van.svg';
import { ReactComponent as IconViewAgenda } from '../assets/icons/view-agenda.svg';
import { ReactComponent as IconVisibilityOff } from '../assets/icons/visibility-off.svg';
import { ReactComponent as IconVisibilityOn } from '../assets/icons/visibility-on.svg';
import { ReactComponent as IconVolumeOff } from '../assets/icons/volume-off.svg';
import { ReactComponent as IconVolumeOn } from '../assets/icons/volume-on.svg';
import { ReactComponent as IconWagon } from '../assets/icons/wagon.svg';
import { ReactComponent as IconWarningOutline } from '../assets/icons/warning-outline.svg';
import { ReactComponent as IconWarning } from '../assets/icons/warning.svg';
import { ReactComponent as IconWifiOff } from '../assets/icons/wifi-off.svg';
import { ReactComponent as IconWifi } from '../assets/icons/wifi.svg';
import { ReactComponent as IconZoomIn } from '../assets/icons/zoom-in.svg';
import { ReactComponent as IconZoomOut } from '../assets/icons/zoom-out.svg';

type IconAssetsMap = { [key in IconName]: FunctionComponent<SVGProps<SVGSVGElement>> };

export const MonkIconAssetsMap: IconAssetsMap = {
  '360': Icon360,
  'account-circle': IconAccountCircle,
  'acv': IconAcv,
  'add-comment': IconAddComment,
  'add-image': IconAddImage,
  'add-photo': IconAddPhoto,
  'add': IconAdd,
  'align-left': IconAlignLeft,
  'align-right': IconAlignRight,
  'announcement': IconAnnouncement,
  'arrow-back-ios': IconArrowBackIos,
  'arrow-back': IconArrowBack,
  'arrow-down': IconArrowDown,
  'arrow-drop-down': IconArrowDropDown,
  'arrow-drop-up': IconArrowDropUp,
  'arrow-forward-ios': IconArrowForwardIos,
  'arrow-forward': IconArrowForward,
  'arrow-up': IconArrowUp,
  'attach-money': IconAttachMoney,
  'auto-awesome': IconAutoAwesome,
  'bar-chart': IconBarChart,
  'bell-graph': IconBellGraph,
  'bluetooth-searching': IconBluetoothSearching,
  'bluetooth': IconBluetooth,
  'bookmark-outline': IconBookmarkOutline,
  'bookmark': IconBookmark,
  'calendar-today': IconCalendarToday,
  'calendar': IconCalendar,
  'camera-off': IconCameraOff,
  'camera': IconCamera,
  'cancel': IconCancel,
  'cellular-signal-no-connection': IconCellularSignalNoConnection,
  'check-circle-outline': IconCheckCircleOutline,
  'check-circle': IconCheckCircle,
  'check': IconCheck,
  'chevron-left': IconChevronLeft,
  'chevron-right': IconChevronRight,
  'circle': IconCircle,
  'close': IconClose,
  'cloud-download': IconCloudDownload,
  'cloud-upload': IconCloudUpload,
  'content-cut': IconContentCut,
  'convertible': IconConvertible,
  'copy': IconCopy,
  'coupe': IconCoupe,
  'credit-card': IconCreditCard,
  'credit-score': IconCreditScore,
  'crop': IconCrop,
  'crossover': IconCrossover,
  'delete': IconDelete,
  'diamond': IconDiamond,
  'directions-car': IconDirectionsCar,
  'double-arrow-down': IconDoubleArrowDown,
  'double-arrow-right': IconDoubleArrowRight,
  'double-arrow-up': IconDoubleArrowUp,
  'drag-handle': IconDragHandle,
  'edit': IconEdit,
  'emoji-events': IconEmojiEvents,
  'error-outline': IconErrorOutline,
  'error': IconError,
  'expand-less': IconExpandLess,
  'expand-more': IconExpandMore,
  'facebook': IconFacebook,
  'favorite-outline': IconFavoriteOutline,
  'favorite': IconFavorite,
  'file-download': IconFileDownload,
  'filter-list': IconFilterList,
  'flash-off': IconFlashOff,
  'flashlight-off': IconFlashlightOff,
  'flashlight-on': IconFlashlightOn,
  'full-screen': IconFullScreen,
  'gavel': IconGavel,
  'grid-off': IconGridOff,
  'grid-on': IconGridOn,
  'grid': IconGrid,
  'hatchback': IconHatchback,
  'help-outline': IconHelpOutline,
  'help': IconHelp,
  'history': IconHistory,
  'image': IconImage,
  'info': IconInfo,
  'instagram': IconInstagram,
  'keyboard': IconKeyboard,
  'lightbulb': IconLightbulb,
  'limo': IconLimo,
  'linkedin': IconLinkedin,
  'location-on': IconLocationOn,
  'location': IconLocation,
  'lock-open': IconLockOpen,
  'lock': IconLock,
  'mail': IconMail,
  'menu': IconMenu,
  'merge': IconMerge,
  'mic': IconMic,
  'minivan': IconMinivan,
  'more-horizontal': IconMoreHorizontal,
  'more-vertical': IconMoreVertical,
  'multiline-chart': IconMultilineChart,
  'notifications-outline': IconNotificationsOutline,
  'notifications': IconNotifications,
  'odometer': IconOdometer,
  'off-road': IconOffRoad,
  'offer-sent': IconOfferSent,
  'open-in-new': IconOpenInNew,
  'paid': IconPaid,
  'pause': IconPause,
  'person-outline': IconPersonOutline,
  'play-arrow': IconPlayArrow,
  'podcast': IconPodcast,
  'price-check': IconPriceCheck,
  'print': IconPrint,
  'priority-high': IconPriorityHigh,
  'progress': IconProgress,
  'public': IconPublic,
  'qr-code-scanner': IconQrCodeScanner,
  'redo': IconRedo,
  'refresh': IconRefresh,
  'remove-circle': IconRemoveCircle,
  'remove': IconRemove,
  'reply': IconReply,
  'report-problem': IconReportProblem,
  'roadster': IconRoadster,
  'robot': IconRobot,
  'rotate': IconRotate,
  'scan': IconScan,
  'search': IconSearch,
  'sedan': IconSedan,
  'selected': IconSelected,
  'sell': IconSell,
  'settings-outline': IconSettingsOutline,
  'settings': IconSettings,
  'share-ios': IconShareIos,
  'share': IconShare,
  'show-chart': IconShowChart,
  'sort': IconSort,
  'store': IconStore,
  'suv': IconSuv,
  'sync-problem': IconSyncProblem,
  'text-snippet': IconTextSnippet,
  'timer': IconTimer,
  'trending-up': IconTrendingUp,
  'truck': IconTruck,
  'tune': IconTune,
  'twitter': IconTwitter,
  'undo': IconUndo,
  'unfold-more': IconUnfoldMore,
  'van': IconVan,
  'view-agenda': IconViewAgenda,
  'visibility-off': IconVisibilityOff,
  'visibility-on': IconVisibilityOn,
  'volume-off': IconVolumeOff,
  'volume-on': IconVolumeOn,
  'wagon': IconWagon,
  'warning-outline': IconWarningOutline,
  'warning': IconWarning,
  'wifi-off': IconWifiOff,
  'wifi': IconWifi,
  'zoom-in': IconZoomIn,
  'zoom-out': IconZoomOut,
};
