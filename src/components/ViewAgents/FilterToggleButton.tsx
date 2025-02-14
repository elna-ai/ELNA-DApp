import classNames from "classnames";

type FilterToggleButtonProps = {
  isActive: boolean;
  label: string;
  className?: string;
  iconClass: string;
  onClick: () => void;
};

function FilterToggleButton({
  isActive,
  label,
  className = "",
  iconClass,
  onClick,
}: FilterToggleButtonProps) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "popular-wizards__filter-tokenized",
        { "popular-wizards__filter-tokenized--active": isActive },
        className
      )}
    >
      <i className={iconClass} />
      <span>{label}</span>
    </div>
  );
}

export default FilterToggleButton;
