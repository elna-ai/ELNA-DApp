import classNames from "classnames";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

interface BubbleProps {
  message?: string;
  user: { name: string };
  isLoading: boolean;
}

function Bubble({ user, message, isLoading = false }: BubbleProps) {
  const { t } = useTranslation();

  // TODO: make this function general to all bots
  const isUserElan = () => user?.name?.toLowerCase() === "elna";
  const sanitize = DOMPurify.sanitize;

  return (
    <div
      className={classNames({
        "chat-bubble__wrapper--user":!isUserElan()
      })}
    >
      <div
        className={classNames("mt-2 sm:mt-6 flex w-full gap-2 chat-bubble", {
          "flex-row-reverse chat-bubble--user": !isUserElan(),
        })}
      >
        <div
          className={classNames(
            "chat-bubble__name",
            {
              "chat-bubble__name--bot": isUserElan(),
            }
          )}
        >
          {user?.name[0]?.toUpperCase()}
        </div>
        <div>
          <div
            className={classNames("chat-bubble__message--wrapper", {
              "chat-bubble__message--wrapper--user": !isUserElan(),

              "chat-bubble__message--wrapper--bot": isUserElan(),
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
                className="chat-bubble__message"
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
