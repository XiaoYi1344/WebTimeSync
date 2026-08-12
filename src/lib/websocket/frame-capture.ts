export interface CaptureFrameOptions {
  width?: number;
  quality?: number;
}

export async function captureVideoFrame(
  video: HTMLVideoElement,
  options: CaptureFrameOptions = {},
): Promise<string | null> {
  if (
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    video.videoWidth === 0 ||
    video.videoHeight === 0
  ) {
    return null;
  }

  const {
    width = 640,
    quality = 0.75,
  } = options;

  const ratio =
    video.videoHeight / video.videoWidth;

  const height = Math.round(width * ratio);

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  /**
   * Mirror frame giống camera preview.
   *
   * Nếu backend model không cần mirror,
   * có thể bỏ phần transform này.
   */
  ctx.save();

  ctx.translate(width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(
    video,
    0,
    0,
    width,
    height,
  );

  ctx.restore();

  return canvas.toDataURL(
    "image/jpeg",
    quality,
  );
}