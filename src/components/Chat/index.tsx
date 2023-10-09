import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router-dom";

import PageLoader from "components/common/PageLoader";
import Bubble from "./Bubble";
import { AVATAR_DUMMY_IMAGE, BASE_URL, DEFAULT_USER } from "./constants";
import NoHistory from "./NoHistory";
import { Button } from "react-bootstrap";

// TODO: convert from ws to webassembly
function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isResponseLoading, setIsResponseLoading] = useState(false);

  const { id } = useParams();
  const [socketUrl, setSocketUrl] = useState(`${BASE_URL}/chat?uuid=${id}`);

  const inputRef = useRef(null);
  const lastBubbleRef = useRef(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  // const { data: agent, isLoading } = useShowUserAgent({ agentId: id });
  const agent ={};
  const isLoading = false;

  useEffect(() => {
    if (isLoading === false) {
      // message: agent.greeting
      const newMessage = { user: DEFAULT_USER, };
      setMessages(prev => [...prev, newMessage]);
    }
  }, [isLoading]);

  useEffect(() => {
    if (lastMessage !== null) {
      setIsResponseLoading(false);
      const newMessage = { user: DEFAULT_USER, message: lastMessage.data };
      setMessages(prev => [...prev, newMessage]);
      // lastBubbleRef.current = newMessage;
    }
  }, [lastMessage, setMessages]);

  useEffect(() => {
    if (lastBubbleRef.current) {
      lastBubbleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  const handleClickSendMessage = useCallback(
    message => sendMessage(message),
    []
  );

  const imgUrl = AVATAR_DUMMY_IMAGE.find(dummy => dummy.id === id)?.imgUrl;

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Open",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  // }[readyState];

  const { t } = useTranslation();

  const handleSubmit = () => {
    setMessages(prev => [
      ...prev,
      { user: { name: "User" }, message: messageInput.trim() },
    ]);
    setIsResponseLoading(true);
    handleClickSendMessage(messageInput.trim());
    setMessageInput("");
  };

  const handleKeyDown = event => {
    // make it command + Enter
    if (
      event.key === "Enter" &&
      messageInput.trim() &&
      readyState === ReadyState.OPEN &&
      !isResponseLoading
    ) {
      handleSubmit();
    }
  };

  useEffect(() => inputRef?.current?.focus(), [agent]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="row chatapp-single-chat">
      <div className="container-fluid">
        <div>
          <header className="text-left">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avatar">
                  {imgUrl && (
                    <img src={imgUrl} alt="user" className="avatar-img" />
                  )}
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h3 className="text-lg mt-2">{agent?.name}</h3>
                <p className="text-muted fs-8">{agent.biography}</p>
              </div>
            </div>
            <hr className="mt-2" />
          </header>
        </div>
        <div className="w-100 mt-28 mb-[120px]">
          <div className="sm:mx-2 mx-8">
            {messages.length > 0 ? (
              <>
                {messages.map(({ user, message }, index) => (
                  <Bubble
                    key={crypto.randomUUID()}
                    user={user}
                    message={message}
                    ref={index === messages.length - 1 ? lastBubbleRef : null}
                  />
                ))}
                {isResponseLoading && (
                  <Bubble
                    key={crypto.randomUUID()}
                    user={DEFAULT_USER}
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
          <div className="chatfooter-bg shadow rounded">
            <div className="input-position-set">
              <textarea
                placeholder={t("chat.inputPlaceholder")}
                className="rounded-3 chat-input-area resize-none"
                value={messageInput}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onChange={event => setMessageInput(event.target.value)}
              ></textarea>
              <Button
                onClick={handleSubmit}
                className="absolute right-2 bottom-1.5"
                disabled={
                  !messageInput.trim() ||
                  readyState !== ReadyState.OPEN ||
                  isResponseLoading
                }
              >{t("common.send")}</Button>
            </div>
            <p className="text-muted fs-8 text-center">{t("chat.warning")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
