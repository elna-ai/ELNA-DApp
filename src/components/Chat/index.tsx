import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import PageLoader from "components/common/PageLoader";
import {
  generateTwitterShareLink,
  transformHistory,
  transformHistoryToMessages,
} from "src/utils";
import useAutoSizeTextArea from "hooks/useAutoResizeTextArea";
import { useShowWizard } from "hooks/reactQuery/wizards/useWizard";
import { useUpdateMessagesReplied } from "hooks/reactQuery/wizards/useAnalytics";
import { useCreatingQuestionEmbedding } from "hooks/reactQuery/useExternalService";
import {
  useChat,
  useDeleteAgentChatHistory,
  useGetAgentChatHistory,
} from "hooks/reactQuery/useRag";
import { isRagErr } from "utils/ragCanister";
import { useGetAsset } from "hooks/reactQuery/useElnaImages";
import { useGetUserProfile } from "hooks/reactQuery/useUser";

import Bubble from "./Bubble";
import { TWITTER_HASHTAGS, TWITTER_SHARE_CONTENT } from "./constants";
import { UseScrollToBottom } from "hooks/useScrollDownButton";
import classNames from "classnames";
import WalletList from "components/common/Header/WalletList";
import { useChatStore } from "stores/useMessages";
import { useWallet } from "hooks/useWallet";

function Chat() {
  const [isWalletListOpen, setIsWalletListOpen] = useState(false);

  const { id } = useParams();

  const {
    data: wizard,
    isFetching: isLoadingWizard,
    error,
    isError,
  } = useShowWizard(id);

  const wallet = useWallet();

  const historyId: `${string}-${string}` | undefined =
    wallet?.principalId === null || id === undefined
      ? undefined
      : `${wallet?.principalId}-${id}`;

  const chats = useChatStore((state) => state.chats);
  const updateMessage = useChatStore((state) => state.updateChat);
  const resetChat = useChatStore((state) => state.resetChat);
  const messages = historyId === undefined ? undefined : chats?.[historyId];

  const { data: agentHistory, isFetching: isLoadingAgentHistory } =
    useGetAgentChatHistory(id);

  const [messageInput, setMessageInput] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastBubbleRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { mutate: updateMessagesReplied } = useUpdateMessagesReplied();
  const { mutate: createQuestionEmbedding } = useCreatingQuestionEmbedding();
  useAutoSizeTextArea(inputRef.current, messageInput);
  const { mutate: sendChat, isPending: isResponseLoading } = useChat();
  const { data: avatar } = useGetAsset(wizard?.avatar);
  const { data: userProfile, isFetching: isUserProfileLoading } =
    useGetUserProfile(wizard?.userId);
  const { mutate: deleteChatHistory, isPending: isDeletingChatHistory } =
    useDeleteAgentChatHistory();


  const { showButton, scrollToBottom } = UseScrollToBottom();

  const setInitialMessage = () => {
    if (wizard?.greeting === undefined || historyId === undefined) return;
    updateMessage(historyId, {
      user: { name: wizard.name, isBot: true },
      message: wizard.greeting,
    });
  };

  const clearChatFn = () => {
    deleteChatHistory(wizard?.id);
    historyId && resetChat(historyId)
    setInitialMessage();
  };

  useEffect(() => {
    if (!isError) return;
    toast.error(error.message);
  }, [isError]);

  useEffect(() => {
    if (wizard === undefined || historyId === undefined) return;
    if (messages !== undefined) return;
    if (isLoadingAgentHistory) return;
    if (agentHistory === null || agentHistory === undefined) {
      updateMessage(historyId, {
        user: { name: wizard.name, isBot: true },
        message: wizard.greeting,
      });
    } else {
      updateMessage(
        historyId,
        transformHistoryToMessages(agentHistory, wizard.name)
      );
    }
  }, [wizard, agentHistory, isLoadingAgentHistory, historyId]);

  const handleSubmit = async () => {
    const message = messageInput.trim();
    if (historyId === undefined) {
      toast.error("historyId not available");
      console.error("historyId not available", historyId);
      return;
    }
    updateMessage(historyId, { user: { name: "User" }, message });
    setMessageInput("");
    createQuestionEmbedding(message, {
      onSuccess(data) {
        const embeddings = data.data.body.vectors;
        sendChat(
          {
            agentId: wizard!.id,
            queryText: message,
            embeddings,
            history: messages ? transformHistory(messages) : [],
          },
          {
            onSuccess: response => {
              if (isRagErr(response)) {
                toast.error("something went wrong");
                console.error(Object.keys(response.Err).join());
                return;
              }
              updateMessage(historyId, {
                user: { name: wizard!.name, isBot: true },
                message: response.Ok?.body?.response,
              });
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

  if (
    isLoadingWizard ||
    !wizard ||
    isLoadingAgentHistory ||
    isDeletingChatHistory
  )
    return <PageLoader />;

  return (
    <div className="row chatapp-single-chat">
      <Button
        onClick={scrollToBottom}
        className={classNames({ "d-none": !showButton })}
        style={{
          position: "fixed",
          bottom: "150px",
          right: "20px",
          width: "fit-content",
        }}
      >
        <i className="ri-arrow-down-line"></i>
      </Button>
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
                    overlay={<Tooltip>{wizard.description}</Tooltip>}
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
                      onClick={() =>
                        window.open(
                          generateTwitterShareLink(
                            `${TWITTER_SHARE_CONTENT(
                              wizard.name,
                              `${window.location.origin}/chat/${id}`,
                              userProfile?.xHandle[0] || ""
                            )}`,
                            TWITTER_HASHTAGS
                          )
                        )
                      }
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
            {messages?.map(({ user, message }, index) => (
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
      <WalletList
        isOpen={isWalletListOpen}
        onClose={() => setIsWalletListOpen(false)}
      />
    </div>
  );
}

export default Chat;
