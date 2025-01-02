import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import PageLoader from "components/common/PageLoader";
import { generateTwitterShareLink, transformHistory, transformHistoryToMessages } from "src/utils";
import useAutoSizeTextArea from "hooks/useAutoResizeTextArea";
import { Message } from "src/types";
import { useShowWizard } from "hooks/reactQuery/wizards/useWizard";
import { useUpdateMessagesReplied } from "hooks/reactQuery/wizards/useAnalytics";
import { useCreatingQuestionEmbedding } from "hooks/reactQuery/useExternalService";
import { useChat, useDeleteAgentChatHistory, useGetAgentChatHistory } from "hooks/reactQuery/useRag";
import { isRagErr } from "utils/ragCanister";
import { useChatStore } from "stores/useChatStore";
import { useUserStore } from "stores/useUser";
import { useGetAsset } from "hooks/reactQuery/useElnaImages";
import { useGetUserProfile } from "hooks/reactQuery/useUser";

import Bubble from "./Bubble";
import NoHistory from "./NoHistory";
import { TWITTER_HASHTAGS, TWITTER_SHARE_CONTENT } from "./constants";
import { UseScrollToBottom } from "hooks/useScrollDownButton";

function Chat() {

  const { id } = useParams();

  const {
    data: agentHistory,
    isFetching: isLoadingAgentHistory,
  } = useGetAgentChatHistory(id);

  const {
    data: wizard,
    isFetching: isLoadingWizard,
    error,
    isError,
  } = useShowWizard(id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastBubbleRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
  const { mutate: updateMessagesReplied } = useUpdateMessagesReplied();
  const { mutate: createQuestionEmbedding } = useCreatingQuestionEmbedding();
  useAutoSizeTextArea(inputRef.current, messageInput);
  const { mutate: sendChat, isPending: isResponseLoading } = useChat();
  const { data: avatar } = useGetAsset(wizard?.avatar);
  const { data: userProfile, isFetching: isUserProfileLoading } =
    useGetUserProfile(wizard?.userId);
  const { mutate: deleteChatHistory, isPending: isDeletingChatHistory } = useDeleteAgentChatHistory();

  const createChat = useChatStore((state) => state.createChat);
  const retrieveChat = useChatStore((state) => state.retrieveChat);
  const updateChat = useChatStore((state) => state.updateChat);
  const clearChat = useChatStore((state) => state.clearChat);

  const setInitialMessage = () => {
    if (wizard?.greeting === undefined) return;
    const localStorageChat = retrieveChat(wizard.id);
    console.log("localStorageChat", localStorageChat);
    if(localStorageChat !== undefined && localStorageChat.length > 0) setMessages(localStorageChat);
    else {
      const initialMessage = {
        user: { name: wizard.name, isBot: true },
        message: wizard.greeting,
      };
      setMessages([initialMessage]);
      createChat(wizard.id);
    }
  };

  const clearChatFn = () => {
    deleteChatHistory(wizard?.id);
    clearChat(wizard!.id);
    setInitialMessage();
  };

  useEffect(() => {
    if (!isError) return;
    toast.error(error.message);
  }, [isError]);

  useEffect(() => {
    if (!isLoadingAgentHistory && agentHistory !== undefined && wizard?.name !== undefined) {
      if (agentHistory?.length > 0) {
        setMessages(transformHistoryToMessages(agentHistory, wizard?.name));
        return;
      }
    }
    else setInitialMessage()
  }, [wizard, isLoadingAgentHistory, agentHistory]);

  useEffect(() => {
    if (lastBubbleRef.current) {
      lastBubbleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
    if(messages.length <= 0) {
      console.log("yaaah")
      setInitialMessage();
    }
  }, [messages]);

  const handleSubmit = async () => {
    const message = messageInput.trim();
    setMessages(prev => [...prev, { user: { name: "User" }, message }]);
    updateChat(wizard!.id, { user: { name: "User" }, message });
    setMessageInput("");
    createQuestionEmbedding(message, {
      onSuccess(data) {
        const embeddings = data.data.body.vectors;
        sendChat(
          {
            agentId: wizard!.id,
            queryText: message,
            embeddings,
            history: isUserLoggedIn ? [] : transformHistory(messages),
          },
          {
            onSuccess: response => {
              if (isRagErr(response)) {
                toast.error("something went wrong");
                console.error(Object.keys(response.Err).join());
                return;
              }
              const reply = {
                user: { name: wizard!.name, isBot: true },
                message: response?.Ok?.body?.response,
              }
              updateMessagesReplied(wizard?.id || "");
              setMessages(prev => [...prev, reply]);
              updateChat(wizard!.id, reply);
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

  if (isLoadingWizard || !wizard || isLoadingAgentHistory || isDeletingChatHistory) return <PageLoader />;

  return (
    <div className="row chatapp-single-chat">
      <UseScrollToBottom />
      <div className="container-fluid">
        <div>
          <header className="text-left">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="chat-header__avatar">
                  <div className="avatar">
                    <img
                      src={avatar?.asset}
                      alt="user"
                      className="avatar-img"
                    />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="text-lg mt-2">{wizard.name}</h3>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip className="">
                        {wizard.description}
                      </Tooltip>
                    }
                  >
                    <div className="cursor-pointer">
                      <p className="text-desc fs-8">{wizard.description}</p>
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
              <div>
                <Dropdown className="card-body-menu">
                  <Dropdown.Toggle
                    variant="dark"
                    className="card-body-menu-button"
                  >
                    <i className="ri-more-line" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => clearChatFn()}>
                      Clear chat history
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => window.open(generateTwitterShareLink(
                        `${TWITTER_SHARE_CONTENT(
                          wizard.name,
                          `${window.location.origin}/chat/${id}`,
                          userProfile?.xHandle[0] || ""
                        )}`,
                        TWITTER_HASHTAGS
                      ))}
                      className="card-dropdown-delete"
                    >
                      Share
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <hr className="mt-2" />
          </header>
        </div>
        <div className="chat-body">
          {/* TODO: media query to be converted to scss */}
          <div className="sm:mx-2 chat-body--wrapper">
            {messages.length > 0 && (
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
            ) 
            // : (
            //   <NoHistory />
            // )
            }
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