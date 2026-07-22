import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

/** Full-screen crop sheet, mobile-first: the photo fits the viewport inside
 * a fixed overlay (it used to spill off-screen), drag to frame, pinch or
 * slide to zoom, actions pinned to the bottom. */
const ImageCropper = ({ img, setCroppedImage, handleCloseCropper }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (saving) return;
    setSaving(true);
    try {
      setCroppedImage(await getCroppedImg(img, croppedAreaPixels));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="px-4 pt-4 pb-2 text-center shrink-0">
        <h3 className="font-semibold text-white">Crop image</h3>
        <p className="text-xs text-white/60">
          Drag to move · pinch or slide to zoom
        </p>
      </div>

      {/* react-easy-crop fills its nearest positioned parent */}
      <div className="relative flex-grow min-h-0">
        <Cropper
          image={img}
          crop={crop}
          zoom={zoom}
          aspect={1}
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div className="px-6 pt-4 pb-8 space-y-4 shrink-0">
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label="Zoom"
          className="w-full accent-primary"
        />
        <div className="flex gap-3">
          <button
            className="w-1/2 py-2.5 font-semibold text-white border rounded-full border-white/40"
            onClick={handleCloseCropper}
          >
            Cancel
          </button>
          <button
            className="w-1/2 py-2.5 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
            onClick={handleCrop}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;

export const readImageFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

/** Crop straight from the source rect, capped at 640px square -- logos never
 * need more, and small files can't trip the upload size limit. */
export const getCroppedImg = (imageSrc, cropArea, maxSize = 640) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const out = Math.round(Math.min(maxSize, cropArea.width));
      const canvas = document.createElement("canvas");
      canvas.width = out;
      canvas.height = out;
      canvas
        .getContext("2d")
        .drawImage(
          image,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          out,
          out
        );
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    image.onerror = reject;
  });
};
