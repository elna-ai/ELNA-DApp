import { useRef } from "react";
import classNames from "classnames";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

type BubbleProps = {
  message?: string;
  user: {
    name: string;
    isBot?: boolean;
  };
  isLoading?: boolean;
} & React.HTMLProps<HTMLDivElement>;

function Bubble({ user, message, isLoading = false }: BubbleProps) {
  const { t } = useTranslation();
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  const isUserBot = user?.isBot ?? false;
  const sanitize = DOMPurify.sanitize;

  return (
    <div
      ref={bubbleRef}
      className={classNames({
        "chat-bubble__wrapper--user": !isUserBot,
      })}
    >
      <div
        className={classNames("sm:mt-6 chat-bubble", {
          "chat-bubble--user": !isUserBot,
        })}
      >
        <div
          className={classNames("chat-bubble__name", {
            "chat-bubble__name--bot": isUserBot,
          })}
        >
          {user?.name[0]?.toUpperCase()}
        </div>
        <div>
          <div
            className={classNames("chat-bubble__message--wrapper", {
              "chat-bubble__message--wrapper--user": !isUserBot,

              "chat-bubble__message--wrapper--bot": isUserBot,
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
                  __html: sanitize(message || ""),
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
