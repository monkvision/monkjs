/**
 * Datamap that associates mimetypes to known file extensions corresponding to this mimetype.
 */
export const MIMETYPE_FILE_EXTENSIONS: Record<string, string[]> = {
  'text/plain': ['txt'],
  'text/html': ['html', 'htm', 'shtml'],
  'text/css': ['css'],
  'text/xml': ['xml'],

  'image/gif': ['gif'],
  'image/jpeg': ['jpeg', 'jpg'],
  'image/png': ['png'],
  'image/tiff': ['tif', 'tiff'],
  'image/vnd.wap.wbmp': ['wbmp'],
  'image/x-icon': ['ico'],
  'image/x-jng': ['jng'],
  'image/x-ms-bmp': ['bmp'],
  'image/svg+xml': ['svg'],
  'image/webp': ['webp'],

  'application/octet-stream': ['bin', 'exe', 'dll', 'eot', 'iso', 'img', 'msi', 'msp', 'msm'],
  'application/x-javascript': ['js'],
  'application/pdf': ['pdf'],
  'application/xhtml+xml': ['xhtml'],
  'application/zip': ['zip'],

  'audio/midi': ['mid', 'midi', 'kar'],
  'audio/mpeg': ['mp3'],
  'audio/ogg': ['ogg'],
  'audio/x-realaudio': ['ra'],

  'video/3gpp': ['3gpp', '3gp'],
  'video/mpeg': ['mpeg', 'mpg'],
  'video/quicktime': ['mov'],
  'video/x-flv': ['flv'],
  'video/x-mng': ['mng'],
  'video/x-ms-asf': ['asx', 'asf'],
  'video/x-ms-wmv': ['wmv'],
  'video/x-msvideo': ['avi'],
  'video/mp4': ['m4v', 'mp4'],
};

/**
 * Returns a list of file extensions known to be corresponding to the given mimetype. If no file extension is known for
 * this mimetype, this function will throw an error.
 */
export function getFileExtensions(mimetype: string): string[] {
  const extensions = MIMETYPE_FILE_EXTENSIONS[mimetype];
  if (!extensions) {
    throw new Error(`Unknown mimetype : ${mimetype}`);
  }
  return extensions;
}

/**
 * Returns the mimetype associated with the given file extension. If the file extension is unknown, this function will
 * throw an error.
 */
export function getMimetype(fileExtension: string): string {
  const mimetype = Object.entries(MIMETYPE_FILE_EXTENSIONS).find(([, extensions]) =>
    extensions.includes(fileExtension),
  )?.[0];
  if (!mimetype) {
    throw new Error(`Unknown file extension : ${fileExtension}`);
  }
  return mimetype;
}
