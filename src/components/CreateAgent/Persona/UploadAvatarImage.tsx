import { useState } from 'react';
import classNames from "classnames";
import { toast } from "react-toastify";

import tickSolid from "images/tickSolid.png";

type UploadAvatarImageProps = {
  selected: boolean;
  customImageNameRef: React.MutableRefObject<string>;
  onAvatarSelected: (image: string) => void;
};

function UploadAvatarImage({
  selected,
  customImageNameRef,
  onAvatarSelected,
}: UploadAvatarImageProps
) {
  
  const [previewSrc, setPreviewSrc] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size <= 500 * 1024) {
      const reader = new FileReader();
      customImageNameRef.current = file.name;

      reader.onload = () => {
        const base64String = reader.result as string;
        setPreviewSrc(base64String);
        onAvatarSelected(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      toast('Image size exceeds 500 KB. Please upload a smaller image.');
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
          className="custom-avatar-parent btn avatar-image bg-dark d-flex align-items-center justify-content-center" 
          htmlFor="avatarUpload"
          >
          <i className="ri-upload-2-fill custom-avatar-parent__child text-white"></i>
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
          className="avatar-image"/>
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