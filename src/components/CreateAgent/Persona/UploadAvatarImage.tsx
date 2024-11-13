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
  const [preview, setPreview] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size <= 500 * 1024) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onAvatarSelected?.(base64String);
      };
      reader.readAsDataURL(file);       // Convert image to Base64
    } else {
      toast('File size exceeds 500 KB. Please upload a smaller file.');
    }
  };

  return (
    <div
      // onClick={setAvatar}
      className={classNames("avatar-image-wrapper", {
          "avatar-image--selected": preview && selected,
          // "avatar-image--preview": preview,
        })}
      > 
        {preview &&
          <img
            src={preview} alt="Preview"
            className={classNames("avatar-image", {
              // "avatar-image--preview": preview,
              // "avatar-image--loading": isLoading,
          })}/>
        }
        <>
          <input
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            hidden
            id="avatarUpload" 
          />
          <label 
            className="parent z-index-2 btn position-absolute bg-transparent avatar-image d-flex align-items-center justify-content-center" 
            htmlFor="avatarUpload"
          >
            <CameraIcon 
              className={classNames("stroke-light bg-transparent w-4", {
                "child": preview,
              })}
            />
          </label>
        </>
        {selected && (
        <img
          className="avatar-image__tick"
          src={tickSolid}
          alt="selected avatar"
        />
      )}
    </div>
  );
}

export default UploadAvatarImage;