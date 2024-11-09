import classNames from "classnames";
import { useGetAsset } from "hooks/reactQuery/useElnaImages";

import tickSolid from "images/tickSolid.png";

type AvatarImageProps = {
  assetId: string;
  selected: boolean;
  onClick?: () => void;
  preview?: boolean;
};

function AvatarImage({
  assetId,
  selected,
  onClick,
  preview = false,
}: AvatarImageProps) {
  const { data } = useGetAsset(assetId);

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
        src={data?.asset}
        alt={`avatar ${data?.file_name}`}
      />
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

export default AvatarImage;
