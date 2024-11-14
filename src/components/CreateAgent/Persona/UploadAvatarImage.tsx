import { useState } from 'react';
import classNames from "classnames";
import { toast } from "react-toastify";

import CameraIcon from "src/assets/camera.svg?react";
import tickSolid from "images/tickSolid.png";

type UploadAvatarImageProps = {
  selected: boolean;
  onAvatarSelected?: (image: string) => void;
};

function UploadAvatarImage({
  selected,
  onAvatarSelected,
}: UploadAvatarImageProps
) {
  const [previewSrc, setPreviewSrc] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size <= 500 * 1024) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        setPreviewSrc(base64String);
        onAvatarSelected?.(base64String);
      };
      reader.readAsDataURL(file);       // Convert image to Base64
    } else {
      toast('File size exceeds 500 KB. Please upload a smaller file.');
    }
  };

  return (
    <>
      <div className="avatar-image-wrapper">
        <input
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          hidden
          id="avatarUpload" 
          />
        <label 
          className="parent btn avatar-image bg-dark d-flex align-items-center justify-content-center" 
          htmlFor="avatarUpload"
          >
          <CameraIcon 
            className="child stroke-light w-6"
            />
        </label>
      </div>
      {previewSrc &&
        <div
          onClick={() => onAvatarSelected?.(previewSrc)}
          className={classNames("avatar-image-wrapper", {
            "avatar-image--selected": previewSrc && selected,
          })}
        > 
          <img
          src={previewSrc} alt="Preview"
          className={classNames("avatar-image", {
          })}/>
          {selected && (
            <img
            className="avatar-image__tick"
            src={tickSolid}
            alt="selected avatar"
            />
          )}
        </div>
      }
    </>
  );
}

export default UploadAvatarImage;