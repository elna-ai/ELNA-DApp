import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import PageLoader from "components/common/PageLoader";
import {
  generateTwitterShareLink,
  getAvatar,
  transformHistory,
} from "src/utils";

import Bubble from "./Bubble";
import NoHistory from "./NoHistory";
import { elna_ai as elnaAi } from "declarations/elna_ai";
import useAutoSizeTextArea from "hooks/useAutoResizeTextArea";
import { Message } from "src/types";
import { useShowWizard } from "hooks/reactQuery/wizards/useWizard";
import { TWITTER_SHARE_CONTENT } from "./constants";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isResponseLoading, setIsResponseLoading] = useState(false);

  const { id } = useParams();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastBubbleRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const {
    data: wizard,
    isFetching: isLoadingWizard,
    error,
    isError,
  } = useShowWizard(id);
  useAutoSizeTextArea(inputRef.current, messageInput);

  useEffect(() => {
    if (!isError) return;
    toast.error(error.message);
  }, [isError]);

  useEffect(() => {
    if (wizard?.greeting === undefined) return;
    if (messages.length > 0) return;

    const initialMessage = {
      user: { name: wizard.name, isBot: true },
      message: wizard.greeting,
    };
    setMessages(prev => [...prev, initialMessage]);
  }, [wizard]);

  useEffect(() => {
    if (lastBubbleRef.current) {
      lastBubbleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  const handleSubmit = async () => {
    const message = messageInput.trim();
    const history = transformHistory(messages);
    setMessages(prev => [...prev, { user: { name: "User" }, message }]);
    setMessageInput("");
    setIsResponseLoading(true);
    try {
      const response: any = await axios.post(
        `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/chat`,
        {
          biography: wizard!.biography,
          query_text: message,
          greeting: wizard!.greeting,
          index_name: wizard!.id,
          history,
        }
      );

      setIsResponseLoading(false);
      setMessages(prev => [
        ...prev,
        {
          user: { name: wizard!.name, isBot: true },
          message: response.data.body.response,
        },
      ]);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // make it command + Enter
    if (event.key === "Enter" && messageInput.trim() && !isResponseLoading) {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => inputRef?.current?.focus(), [wizard]);

  if (isLoadingWizard || wizard === undefined) return <PageLoader />;

  return (
    <div className="row chatapp-single-chat">
      <div className="container-fluid">
        <div>
          <header className="text-left">
            <div className="d-flex align-items-center">
              <div className="chat-header__avatar">
                <div className="avatar">
                  <img
                    src={getAvatar(wizard.avatar)?.image}
                    alt="user"
                    className="avatar-img"
                  />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h3 className="text-lg mt-2">{wizard.name}</h3>
                <p className="text-desc fs-8">{wizard.description}</p>
              </div>
            </div>
            <div>
              <a
                href={generateTwitterShareLink(
                  `${TWITTER_SHARE_CONTENT}.${window.location.origin}/chat/${id}`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share X
              </a>
            </div>
            <hr className="mt-2" />
          </header>
        </div>
        <div className="chat-body">
          {/* TODO: media query to be converted to scss */}
          <div className="sm:mx-2 chat-body--wrapper">
            {messages.length > 0 ? (
              <>
                {messages.map(({ user, message }, index) => (
                  <Bubble
                    key={uuidv4()}
                    user={user}
                    message={message}
                    ref={index === messages.length - 1 ? lastBubbleRef : null}
                  />
                ))}
                {isResponseLoading && (
                  <Bubble
                    key={uuidv4()}
                    user={{ name: wizard.name, isBot: true }}
                    isLoading
                  />
                )}
              </>
            ) : (
              <NoHistory />
            )}
          </div>
        </div>
        <div className="hk-footer chatfooter">
          <div className="chatfooter-bg">
            <div className="input-position-set">
              <textarea
                placeholder={t("chat.inputPlaceholder")}
                className="chat-input-area"
                value={messageInput}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onChange={event => setMessageInput(event.target.value)}
                rows={1}
              ></textarea>
              <Button
                onClick={handleSubmit}
                className="absolute right-2 bottom-1.5"
                disabled={!messageInput.trim() || isResponseLoading}
              >
                {t("common.send")}
              </Button>
            </div>
            <p className="fs-8 text-center">{t("chat.warning")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
