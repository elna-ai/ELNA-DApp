import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import PageLoader from "components/common/PageLoader";
import {
  generateTwitterShareLink,
  getAvatar,
  transformHistory,
} from "src/utils";
import useAutoSizeTextArea from "hooks/useAutoResizeTextArea";
import { Message } from "src/types";
import { useShowWizard } from "hooks/reactQuery/wizards/useWizard";
import { useUpdateMessagesReplied } from "hooks/reactQuery/wizards/useAnalytics";
import { useCreatingQuestionEmbedding } from "hooks/reactQuery/useExternalService";
import { useChat } from "hooks/reactQuery/useRag";
import { isErr } from "utils/ragCanister";

import Bubble from "./Bubble";
import NoHistory from "./NoHistory";
import { TWITTER_SHARE_CONTENT } from "./constants";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  // const [isResponseLoading, setIsResponseLoading] = useState(false);

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
  const { mutate: updateMessagesReplied } = useUpdateMessagesReplied();
  const { mutate: createQuestionEmbedding } = useCreatingQuestionEmbedding();
  useAutoSizeTextArea(inputRef.current, messageInput);
  const { mutate: sendChat, isPending: isResponseLoading } = useChat();

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
    // TODO: add history support to rag
    // const history = transformHistory(messages);
    setMessages(prev => [...prev, { user: { name: "User" }, message }]);
    setMessageInput("");
    createQuestionEmbedding(message, {
      onSuccess(data) {
        const embeddings = data.data.body.vectors;
        sendChat(
          {
            agentId: wizard!.id,
            queryText: message,
            embeddings,
          },
          {
            onSuccess: response => {
              if (isErr(response)) {
                toast.error("something went wrong");
                console.error(Object.keys(response.Err).join());
                return;
              }

              updateMessagesReplied(wizard?.id || "");
              setMessages(prev => [
                ...prev,
                {
                  user: { name: wizard!.name, isBot: true },
                  message: response?.Ok?.body?.response,
                },
              ]);
            },
            onError: e => {
              console.error(e);
              toast.error(e.message);
            },
          }
        );
      },
      onError: e => toast.error(e.message),
    });
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
            <div className="d-flex justify-content-between align-items-center">
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
                  className="el-btn-secondary"
                  href={generateTwitterShareLink(
                    `${TWITTER_SHARE_CONTENT(
                      wizard.name,
                      `${window.location.origin}/chat/${id}`
                    )}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"></path>
                    </svg>
                  </span>
                  <span className="text-xs sub-title-color">Share</span>
                </a>
              </div>
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
