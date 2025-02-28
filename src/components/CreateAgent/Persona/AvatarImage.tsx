import classNames from "classnames";
import { useGetAsset } from "hooks/reactQuery/useElnaImages";
import AvatarPlaceholder from "src/assets/avatar_placeholder.svg";

import tickSolid from "images/tickSolid.png";
import { toast } from "react-toastify";

type AvatarImageProps = {
  assetId: string;
  selected: boolean;
  onClick?: () => void;
  preview?: boolean;
  isDisabled?: boolean;
};

function AvatarImage({
  assetId,
  selected,
  onClick,
  preview = false,
  isDisabled = false,
}: AvatarImageProps) {
  const { data, isFetching: isLoading } = useGetAsset(assetId);

  return (
    <div
      onClick={() =>
        isDisabled
          ? toast.info("can't edit avatar for tokenized agent")
          : onClick?.()
      }
      className={classNames("avatar-image-wrapper", {
        "avatar-image--selected": selected && !preview,
        "avatar-image--preview": preview,
        "avatar-image--disabled": isDisabled,
      })}
    >
      <img
        className={classNames("avatar-image", {
          "avatar-image--preview": preview,
          "avatar-image--loading": isLoading,
        })}
        src={data?.asset || AvatarPlaceholder}
        alt={isLoading ? "loading" : `avatar ${data?.file_name}`}
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
