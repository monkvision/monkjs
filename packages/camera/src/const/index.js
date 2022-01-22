const DEFAULT_MATCH_MEDIA_OBJECT = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
});

export default {
  DEFAULT_MATCH_MEDIA_OBJECT,
  MOBILE_MAX_WIDTH: 480,
  MOBILE_USERAGENT_PATTERN: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
  RATIO_FACTOR: 240,
  SIDEBAR_WIDTH: 250,
};
