import classNames from "classnames";

import tickSolid from "images/tickSolid.png";

type AvatarImageProps = {
  image: string;
  selected: boolean;
  onClick?: () => void;
  preview?: boolean;
};

function AvatarImage({
  image,
  selected,
  onClick,
  preview = false,
}: AvatarImageProps) {
  return (
    <div
      onClick={onClick}
      className={classNames("avatar-image-wrapper", {
        "avatar-image--selected": selected && !preview,
        "avatar-image--preview": preview,
      })}
    >
      <img
        className={classNames("avatar-image", {
          "avatar-image--preview": preview,
        })}
        src={image}
        alt="Avatar"
      />
      {selected && (
        <img className="avatar-image__tick" src={tickSolid} alt="tick mark" />
      )}
    </div>
  );
}

export default AvatarImage;
