import classNames from "classnames";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

interface BubbleProps {
  message: string,
  user: { name: string },
  isLoading: boolean
}

function Bubble({ user, message, isLoading = false }: BubbleProps) {
  const { t } = useTranslation();

  const isUserElan = () => user?.name?.toLowerCase() === "elna";
  const sanitize = DOMPurify.sanitize;

  return (
    <div
      className={classNames({
        "flex-row-reverse self-end": !isUserElan(),
      })}
    >
      <div
        className={classNames("mt-2 sm:mt-6 flex w-full gap-2", {
          "flex-row-reverse": !isUserElan(),
        })}
      >
        <div
          className={classNames(
            "flex items-center justify-center text-white w-8 bg-primary h-8 rounded bg-purple-600 p-1 aspect-square",
            {
              "bg-green-600": isUserElan(),
            }
          )}
        >
          {user?.name[0]?.toUpperCase()}
        </div>
        <div>
          <div
            className={classNames("min-w-full  max-w-sm p-3", {
              "text-white rounded-l-lg rounded-br-lg bg-primary": !isUserElan(),

              "bg-white rounded-bl-lg ": isUserElan(),
            })}
          >
            {isLoading ? (
              <div className="typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            ) : (
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: sanitize(message),
                }}
              />
            )}
            <div className="media-body">
              <div className="msg-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bubble;
