import { useTranslation, Trans } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import NoAccessImage from "images/no-access.png";

function NoPermission() {
  const { t } = useTranslation();

  return (
    <>
      <Modal.Header
        closeButton
        className="d-flex align-items-center justify-content-center"
      >
        <h3 className="w-100 sub-title text-center">
          {t("common.noPermission")}
        </h3>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img
          className="mx-auto d-block"
          src={NoAccessImage}
          alt="No-permission-Elna"
          width={180}
        />
        <p className="mb-0">{t("createAgent.noPermission.title")}</p>
        <p>{t("createAgent.noPermission.gainAccess")}</p>
        <p>
          <Trans
            i18nKey="createAgent.noPermission.askAccess"
            components={{
              a: (
                <a
                  href="https://forms.gle/9ikyydFgUV6vEdZ58"
                  className="elna-link text-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              u: <u />,
              strong: <strong />,
            }}
          />
        </p>
      </Modal.Body>
    </>
  );
}

export default NoPermission;
