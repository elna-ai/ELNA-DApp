import classNames from "classnames";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { ButtonVariant } from "react-bootstrap/esm/types";

type LoadingButtonProps = {
  isDisabled?: boolean;
  isLoading?: boolean;
  label: string;
  className?: string;
  variant?: ButtonVariant;
  onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

function LoadingButton({
  isDisabled = false,
  isLoading = false,
  label,
  className,
  variant,
  onClick,
}: LoadingButtonProps) {
  return (
    <Button
      className={classNames(
        "ml-auto px-5 d-flex gap-1 align-items-center",
        className
      )}
      variant={variant}
      onClick={onClick}
      disabled={isDisabled}
    >
      {label}
      {isLoading && <Spinner size="sm" />}
    </Button>
  );
}

export default LoadingButton;
