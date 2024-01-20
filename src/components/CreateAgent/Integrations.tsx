import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LoadingButton from "components/common/LoadingButton";

const sampleData = [
  {
    name: "twitter",
    isConnected: false,
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path
          d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"
          fill="#fff"
        ></path>
      </svg>
    ),
  },
  {
    name: "Whatsapp",
    isConnected: false,
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path
          d="M12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2ZM8.59339 7.30019L8.39232 7.30833C8.26293 7.31742 8.13607 7.34902 8.02057 7.40811C7.93392 7.45244 7.85348 7.51651 7.72709 7.63586C7.60774 7.74855 7.53857 7.84697 7.46569 7.94186C7.09599 8.4232 6.89729 9.01405 6.90098 9.62098C6.90299 10.1116 7.03043 10.5884 7.23169 11.0336C7.63982 11.9364 8.31288 12.8908 9.20194 13.7759C9.4155 13.9885 9.62473 14.2034 9.85034 14.402C10.9538 15.3736 12.2688 16.0742 13.6907 16.4482C13.6907 16.4482 14.2507 16.5342 14.2589 16.5347C14.4444 16.5447 14.6296 16.5313 14.8153 16.5218C15.1066 16.5068 15.391 16.428 15.6484 16.2909C15.8139 16.2028 15.8922 16.159 16.0311 16.0714C16.0311 16.0714 16.0737 16.0426 16.1559 15.9814C16.2909 15.8808 16.3743 15.81 16.4866 15.6934C16.5694 15.6074 16.6406 15.5058 16.6956 15.3913C16.7738 15.2281 16.8525 14.9166 16.8838 14.6579C16.9077 14.4603 16.9005 14.3523 16.8979 14.2854C16.8936 14.1778 16.8047 14.0671 16.7073 14.0201L16.1258 13.7587C16.1258 13.7587 15.2563 13.3803 14.7245 13.1377C14.6691 13.1124 14.6085 13.1007 14.5476 13.097C14.4142 13.0888 14.2647 13.1236 14.1696 13.2238C14.1646 13.2218 14.0984 13.279 13.3749 14.1555C13.335 14.2032 13.2415 14.3069 13.0798 14.2972C13.0554 14.2955 13.0311 14.292 13.0074 14.2858C12.9419 14.2685 12.8781 14.2457 12.8157 14.2193C12.692 14.1668 12.6486 14.1469 12.5641 14.1105C11.9868 13.8583 11.457 13.5209 10.9887 13.108C10.8631 12.9974 10.7463 12.8783 10.6259 12.7616C10.2057 12.3543 9.86169 11.9211 9.60577 11.4938C9.5918 11.4705 9.57027 11.4368 9.54708 11.3991C9.50521 11.331 9.45903 11.25 9.44455 11.1944C9.40738 11.0473 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.74939 10.663 9.86248 10.5183C9.97128 10.379 10.0652 10.2428 10.125 10.1457C10.2428 9.95633 10.2801 9.76062 10.2182 9.60963C9.93764 8.92565 9.64818 8.24536 9.34986 7.56894C9.29098 7.43545 9.11585 7.33846 8.95659 7.32007C8.90265 7.31384 8.84875 7.30758 8.79459 7.30402C8.66053 7.29748 8.5262 7.29892 8.39232 7.30833L8.59339 7.30019Z"
          fill="#fff"
        ></path>
      </svg>
    ),
  },
  {
    name: "My website",
    isConnected: false,
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z"
          fill="#fff"
        ></path>
      </svg>
    ),
  },
  {
    name: "Trading Bots",
    isConnected: false,
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M13.5 2C13.5 2.44425 13.3069 2.84339 13 3.11805V5H18C19.6569 5 21 6.34315 21 8V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8C3 6.34315 4.34315 5 6 5H11V3.11805C10.6931 2.84339 10.5 2.44425 10.5 2C10.5 1.17157 11.1716 0.5 12 0.5C12.8284 0.5 13.5 1.17157 13.5 2ZM0 10H2V16H0V10ZM24 10H22V16H24V10ZM9 14.5C9.82843 14.5 10.5 13.8284 10.5 13C10.5 12.1716 9.82843 11.5 9 11.5C8.17157 11.5 7.5 12.1716 7.5 13C7.5 13.8284 8.17157 14.5 9 14.5ZM16.5 13C16.5 12.1716 15.8284 11.5 15 11.5C14.1716 11.5 13.5 12.1716 13.5 13C13.5 13.8284 14.1716 14.5 15 14.5C15.8284 14.5 16.5 13.8284 16.5 13Z"
          fill="#fff"
        ></path>
      </svg>
    ),
  },
  {
    name: "Slack",
    isConnected: false,
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M6.52739 14.5136C6.52739 15.5966 5.64264 16.4814 4.55959 16.4814C3.47654 16.4814 2.5918 15.5966 2.5918 14.5136C2.5918 13.4305 3.47654 12.5458 4.55959 12.5458H6.52739V14.5136ZM7.51892 14.5136C7.51892 13.4305 8.40366 12.5458 9.48671 12.5458C10.5698 12.5458 11.4545 13.4305 11.4545 14.5136V19.4407C11.4545 20.5238 10.5698 21.4085 9.48671 21.4085C8.40366 21.4085 7.51892 20.5238 7.51892 19.4407V14.5136ZM9.48671 6.52715C8.40366 6.52715 7.51892 5.6424 7.51892 4.55935C7.51892 3.4763 8.40366 2.59155 9.48671 2.59155C10.5698 2.59155 11.4545 3.4763 11.4545 4.55935V6.52715H9.48671ZM9.48671 7.51867C10.5698 7.51867 11.4545 8.40342 11.4545 9.48647C11.4545 10.5695 10.5698 11.4543 9.48671 11.4543H4.55959C3.47654 11.4543 2.5918 10.5695 2.5918 9.48647C2.5918 8.40342 3.47654 7.51867 4.55959 7.51867H9.48671ZM17.4732 9.48647C17.4732 8.40342 18.3579 7.51867 19.4409 7.51867C20.524 7.51867 21.4087 8.40342 21.4087 9.48647C21.4087 10.5695 20.524 11.4543 19.4409 11.4543H17.4732V9.48647ZM16.4816 9.48647C16.4816 10.5695 15.5969 11.4543 14.5138 11.4543C13.4308 11.4543 12.546 10.5695 12.546 9.48647V4.55935C12.546 3.4763 13.4308 2.59155 14.5138 2.59155C15.5969 2.59155 16.4816 3.4763 16.4816 4.55935V9.48647ZM14.5138 17.4729C15.5969 17.4729 16.4816 18.3577 16.4816 19.4407C16.4816 20.5238 15.5969 21.4085 14.5138 21.4085C13.4308 21.4085 12.546 20.5238 12.546 19.4407V17.4729H14.5138ZM14.5138 16.4814C13.4308 16.4814 12.546 15.5966 12.546 14.5136C12.546 13.4305 13.4308 12.5458 14.5138 12.5458H19.4409C20.524 12.5458 21.4087 13.4305 21.4087 14.5136C21.4087 15.5966 20.524 16.4814 19.4409 16.4814H14.5138Z"
          fill="#fff"
        ></path>
      </svg>
    ),
  },

  {
    name: "IoT Devices",
    isConnected: false,
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M6 18H18V6H6V18ZM14 20H10V22H8V20H5C4.44772 20 4 19.5523 4 19V16H2V14H4V10H2V8H4V5C4 4.44772 4.44772 4 5 4H8V2H10V4H14V2H16V4H19C19.5523 4 20 4.44772 20 5V8H22V10H20V14H22V16H20V19C20 19.5523 19.5523 20 19 20H16V22H14V20ZM8 8H16V16H8V8Z"
          fill="#fff"
        ></path>
      </svg>
    ),
  },
];
function integrations() {
  const [isConnect, setIsConnect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [integrations, setIntegrations] = useState(sampleData);

  const { t } = useTranslation();

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newIntegrations = integrations.map(integration =>
        integration.name === "twitter"
          ? { ...integration, isConnected: true }
          : integration
      );
      setIntegrations(newIntegrations);
      toast.success("creating twitter bot");
      setIsConnect(false);
    }, 3000);
  };
  return (
    <>
      <div className="w-100">
        <div className="d-flex">
          <h5 className="flex gap-2">
            <span className="me-2">
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8.68637 4.00008L11.293 1.39348C11.6835 1.00295 12.3167 1.00295 12.7072 1.39348L15.3138 4.00008H19.0001C19.5524 4.00008 20.0001 4.4478 20.0001 5.00008V8.68637L22.6067 11.293C22.9972 11.6835 22.9972 12.3167 22.6067 12.7072L20.0001 15.3138V19.0001C20.0001 19.5524 19.5524 20.0001 19.0001 20.0001H15.3138L12.7072 22.6067C12.3167 22.9972 11.6835 22.9972 11.293 22.6067L8.68637 20.0001H5.00008C4.4478 20.0001 4.00008 19.5524 4.00008 19.0001V15.3138L1.39348 12.7072C1.00295 12.3167 1.00295 11.6835 1.39348 11.293L4.00008 8.68637V5.00008C4.00008 4.4478 4.4478 4.00008 5.00008 4.00008H8.68637ZM12.0001 15.0001C13.6569 15.0001 15.0001 13.6569 15.0001 12.0001C15.0001 10.3432 13.6569 9.00008 12.0001 9.00008C10.3432 9.00008 9.00008 10.3432 9.00008 12.0001C9.00008 13.6569 10.3432 15.0001 12.0001 15.0001Z"
                  fill="#ffc107"
                ></path>
              </svg>
            </span>
            Integrations
          </h5>
        </div>
        <div>
          <div className="text-left">
            <div className="d-flex align-items-center">
              <div className="chat-header__avatar">
                <div className="avatar">
                  <img
                    src="http://localhost:3000/images/avatar/01.png"
                    alt="user"
                    className="avatar-img"
                  />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h3 className="text-lg mt-2">SoCal</h3>
                <p className="text-desc fs-8">
                  SoCal is AI-powered ally in navigating the world of social
                  media
                </p>
              </div>
            </div>
            <hr className="mt-2" />
          </div>
        </div>

        <div className="container-fluid mb-5">
          <h6>Your Connected Integration</h6>
          {integrations
            .filter(integration => integration.isConnected)
            .map(({ Icon, name }) => (
              <div className="col-md-8 app-integrated-sec">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="int-app-img">
                      <div className="int-icon">
                        <Icon />
                      </div>
                    </div>
                    <div className="int-app-name ms-2">
                      <p className="mb-0">{name}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="int-button">
                      <button className="btn-primary">Connected</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="container-fluid">
          <h6>Discover More</h6>
          {integrations
            .filter(integration => !integration.isConnected)
            .map(({ name, Icon }) => (
              <div className="col-md-8 app-integrated-sec">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="int-app-img">
                      <div className="int-icon">
                        <Icon />
                      </div>
                    </div>
                    <div className="int-app-name ms-2">
                      <p className="mb-0">{name}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="int-button">
                      <button onClick={() => setIsConnect(true)}>
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <div className="col-md-8 mt-4">
            <div className="d-flex align-items-center justify-content-center">
              <a href="#" className="el-btn-secondary">
                View All
              </a>
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="bot-name-modal"
        size="lg"
        centered
        show={isConnect}
        onHide={() => setIsConnect(false)}
      >
        <Modal.Header closeButton className="d-flex align-items-center">
          <Modal.Title>
            <h5 className="mb-0">
              <strong>{t("createAgent.nameAgent")}</strong>
            </h5>
          </Modal.Title>
        </Modal.Header>

        <Form noValidate onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>
                {t("createAgent.form.label.targetUserid")}
              </Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("createAgent.form.label.bearerToken")}</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("createAgent.form.label.consumerKey")}</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                {t("createAgent.form.label.consumerSecret")}
              </Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("createAgent.form.label.accessToken")}</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                {t("createAgent.form.label.accessTokenSecret")}
              </Form.Label>
              <Form.Control />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="flex">
            <Button
              className="btn-light btn-modal-cancel"
              variant="link"
              type="reset"
              onClick={() => setIsConnect(false)}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <LoadingButton
              label={t("common.ok")}
              isLoading={isLoading}
              isDisabled={isLoading}
              onClick={handleSubmit}
            />
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default integrations;
