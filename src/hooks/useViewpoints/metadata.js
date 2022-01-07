/**
 * a metadata is all information about the picture we take for an inspection.
 */
export class Metadata {
  constructor() {
    this.keypoints = undefined; // TODO Remplace with keypoints ENUMS
    this.heightVisible = undefined;
    this.fit = undefined;
    this.orientation = undefined;
    this.centerPart = undefined;
  }

  /**
     * return the metadata id in the format of:
     * keypoints_visible/height_visible/fit/orientation/centerpart
     * @returns @string
     */
  viewpointName() {
    return `${this.keypoints}/${this.heightVisible}/${this.fit}/${this.orientation}/${this.centerPart}`;
  }
}

export default Metadata;
