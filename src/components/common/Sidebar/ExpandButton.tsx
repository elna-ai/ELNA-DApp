import classNames from "classnames";

interface ExpandButton {
  className?: string;
  handleExpand: () => void;
}

function ExpandButton({ className = "", handleExpand }: ExpandButton) {
  return (
    <button
      className={classNames(
        "btn btn-icon btn-rounded btn-flush-dark flush-soft-hover navbar-toggle",
        className
      )}
      onClick={handleExpand}
    >
      <span className="icon">
        <span className="svg-icon fs-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-arrow-bar-to-left"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#fff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <line x1="10" y1="12" x2="20" y2="12"></line>
            <line x1="10" y1="12" x2="14" y2="16"></line>
            <line x1="10" y1="12" x2="14" y2="8"></line>
            <line x1="4" y1="4" x2="4" y2="20"></line>
          </svg>
        </span>
      </span>
    </button>
  );
}

export default ExpandButton;
