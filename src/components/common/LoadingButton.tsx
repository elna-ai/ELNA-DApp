import classNames from "classnames";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { ButtonVariant } from "react-bootstrap/esm/types";

type LoadingButtonProps = {
  isDisabled?: boolean;
  isLoading: boolean;
  label: string;
  className?: string;
  variant?: ButtonVariant;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "label" | "onClick">;

function LoadingButton({
  isDisabled = false,
  isLoading,
  label,
  className,
  variant,
  onClick = () => {},
  ...otherProps
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
      {...otherProps}
    >
      {label}
      {isLoading && <Spinner size="sm" />}
    </Button>
  );
}

export default LoadingButton;
