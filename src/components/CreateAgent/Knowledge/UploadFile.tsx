import { useState, ChangeEvent } from "react";

import { Document } from "langchain/document";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  getChunks,
  extractDocumentsFromPDF,
  mergeHyphenatedWords,
  fixNewlines,
  removeMultipleNewlines,
} from "src/utils";
import { useNavigate } from "react-router-dom";
import { useCreateIndex } from "hooks/reactQuery/useExternalService";
import LoadingButton from "components/common/LoadingButton";
import queryClient from "utils/queryClient";
import { QUERY_KEYS } from "src/constants/query";

type UploadFileProps = {
  isOpen: boolean;
  agentId: string;
  onClose: () => void;
};

function UploadFile({ isOpen, onClose, agentId }: UploadFileProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: createIndex, isPending: isCreatingIndex } = useCreateIndex();

  const handleClose = () => {
    setSelectedFiles([]);
    setValidationMessage("");
    setIsUploading(false);
    onClose();
  };

  const handleUpload = async () => {
    const documents = await extractDocumentsFromPDF(selectedFiles[0]);
    if (documents === undefined) {
      console.error("unable to extract text from pdf");
      toast.error("unable to extract text from pdf");
      return;
    }

    const cleanedDocuments = documents.map(document => {
      const mergeHyphenated = mergeHyphenatedWords(document.pageContent);
      const newlineFix = fixNewlines(mergeHyphenated);
      const cleanedText = removeMultipleNewlines(newlineFix);
      return new Document({
        metadata: document.metadata,
        pageContent: cleanedText,
      });
    });

    const chunks = await getChunks(cleanedDocuments);
    createIndex(
      {
        documents: chunks,
        index_name: agentId,
        file_name: selectedFiles[0].name,
      },
      {
        onSuccess: () => {
          toast.success("Uploaded successfully");
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.WIZARD_FILE_NAMES],
          });
          onClose();
        },
      }
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files;
    if (inputFiles === null) return;
    if (!event.target.files) return;

    const newFiles = Array.from(inputFiles);
    const validFiles = newFiles.filter(file => {
      const isPDF = file.type === "application/pdf";
      const isSizeValid = file.size <= 5 * 1024 * 1024; // 5MB in bytes
      return isPDF && isSizeValid;
    });

    if (validFiles.length === 0) {
      setValidationMessage(t("createAgent.knowledge.maxFileSize"));
    } else {
      setValidationMessage("");
      setSelectedFiles([...selectedFiles, ...validFiles]);
    }
  };

  return (
    <Modal
      className="bot-name-modal"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={isOpen}
      onHide={handleClose}
    >
      <Modal.Header closeButton className="d-flex align-items-center">
        <Modal.Title>
          <h5 className="mb-0">
            <strong>{t("createAgent.knowledge.addDocuments")}</strong>
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>
              <h6>{t("createAgent.knowledge.uploadFile.title")}</h6>
            </Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
            <p className="mt-2">
              <small>
                <span className="mr-2 info-text">
                  <Trans
                    i18nKey="createAgent.knowledge.uploadFile.maxSize"
                    components={{ b: <b /> }}
                  />
                </span>{" "}
                <span className="info-text">
                  <Trans
                    i18nKey="createAgent.knowledge.uploadFile.supportedType"
                    components={{ b: <b /> }}
                  />
                </span>
              </small>
            </p>
          </Form.Group>
        </Form>
        {validationMessage && (
          <p className="text-danger">{validationMessage}</p>
        )}
        {selectedFiles?.map((file, index) => (
          <>
            <div className="d-flex gap-2 bg-elavate align-items-center justify-content-between p-3 my-2">
              <div className="d-flex align-items-center justify-content-start">
                <div className="btn_icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      d="M5 4H15V8H19V20H5V4ZM3.9985 2C3.44749 2 3 2.44405 3 2.9918V21.0082C3 21.5447 3.44476 22 3.9934 22H20.0066C20.5551 22 21 21.5489 21 20.9925L20.9997 7L16 2H3.9985ZM10.4999 7.5C10.4999 9.07749 10.0442 10.9373 9.27493 12.6534C8.50287 14.3757 7.46143 15.8502 6.37524 16.7191L7.55464 18.3321C10.4821 16.3804 13.7233 15.0421 16.8585 15.49L17.3162 13.5513C14.6435 12.6604 12.4999 9.98994 12.4999 7.5H10.4999ZM11.0999 13.4716C11.3673 12.8752 11.6042 12.2563 11.8037 11.6285C12.2753 12.3531 12.8553 13.0182 13.5101 13.5953C12.5283 13.7711 11.5665 14.0596 10.6352 14.4276C10.7999 14.1143 10.9551 13.7948 11.0999 13.4716Z"
                      fill="var(--elna-primary-color)"
                    ></path>
                  </svg>
                </div>

                <div className="fileNameUpload">
                  <span>{file.name}</span>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-end">
                <Button
                  variant="secondary"
                  className="text-end btn_icon el-bg-danger"
                  onClick={() => {
                    const updatedFiles = [...selectedFiles];
                    updatedFiles.splice(index, 1);
                    setSelectedFiles(updatedFiles);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      d="M17 4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7V2H17V4ZM9 9V17H11V9H9ZM13 9V17H15V9H13Z"
                      fill="rgba(255,255,255,1)"
                    ></path>
                  </svg>
                </Button>
              </div>
            </div>
          </>
        ))}
        {isUploading && (
          <div className="flex items-center gap-2 mt-2">
            <Spinner />
            <span>{t("common.uploading")}</span>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex ml-auto gap-2">
          <LoadingButton
            onClick={handleUpload}
            label={t("common.ok")}
            isLoading={isCreatingIndex}
            isDisabled={isUploading || isCreatingIndex}
          />
          <Button
            className="btn-light btn-modal-cancel"
            variant="link"
            onClick={() => onClose()}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadFile;
