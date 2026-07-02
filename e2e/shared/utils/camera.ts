import path from "path";

export function getChromeArgs(): string[] {
  const y4mPath =
    process.env["FAKE_VIDEO_PATH"] ??
    path.join(__dirname, "../../assets/fake-camera.y4m");
  return [
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
    `--use-file-for-fake-video-capture=${path.resolve(y4mPath)}`,
  ];
}
