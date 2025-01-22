import { Button, CloseButton, Modal, ModalBody } from "react-bootstrap";
import { generateTwitterShareLink } from "utils/index";
import { TWITTER_SHARE_CONTENT } from "./constants";
import { toast } from "react-toastify";

type XShareModalProps = {
    shareModalOpen: boolean;
    handleClose: () => void;
    agentId: string;
    agentName: string;
};

export function XShareModal(
    {
        shareModalOpen,
        handleClose,
        agentId,
        agentName
    }: XShareModalProps
) {

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}/chat/${agentId}`
            );
            toast.success("Copied to clipboard");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    return (
        <Modal show={shareModalOpen} onHide={handleClose} centered>
            <ModalBody>
                <div className="d-flex">
                    <div className="text-center">
                        <h5>Agent Activated</h5>
                        <div>
                            Congrats on your decentralized AI agent {agentName}, built by
                            ELNA
                        </div>
                    </div>
                    <div className="ml-auto">
                        <CloseButton
                            style={{
                                padding: "0.5rem",
                                backgroundColor: "var(--el-btn-bg-secondary)",
                            }}
                            onClick={handleClose}
                        />
                    </div>
                </div>
                <hr className="mt-2"></hr>

                <span className="text-xs">Share agent link</span>
                <div className="d-flex align-items-center justify-space-between copy-sec">
                    <div>{`${window.location.origin}/chat/${agentId}`}</div>
                    <Button className="square-btn me-2" onClick={handleCopyLink}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            style={{ width: "16px" }}
                        >
                            <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                        </svg>
                    </Button>
                </div>
                <a
                    className="btn btn-secondary"
                    href={generateTwitterShareLink(
                        `${TWITTER_SHARE_CONTENT(
                            agentName,
                            `${window.location.origin}/chat/${agentId}`
                        )}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: "126px" }}
                >
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            style={{ width: "16px" }}
                        >
                            <path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"></path>
                        </svg>
                    </span>
                    <span className="text-xs sub-title-color">Share Twitter</span>
                </a>
            </ModalBody>
        </Modal>
    )
}
