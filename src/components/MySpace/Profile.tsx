import { useState } from "react";
import LoadingButton from "components/common/LoadingButton";
import PageLoader from "components/common/PageLoader";
import Spinner from "react-bootstrap/Spinner";
import { Formik } from "formik";
import {
  useAddUserProfile,
  useGetUserProfile,
  useUpdateUserProfile,
} from "hooks/reactQuery/useUser";
import { useIsDeveloper, useGetUserRequest } from "hooks/reactQuery/useDeveloper";
import { Button, Form, Badge } from "react-bootstrap";
import FormikInput from "components/common/FormikInput";
import { Trans, useTranslation } from "react-i18next";
import creatorIcon from "src/images/creator.svg";
import AvatarImg from "images/avatar.png";
import {
  USER_PROFILE_FORM_INITIAL,
  USER_PROFILE_FORM_VALIDATION,
  TWITTER_SHARE_CONTENT,
  TWITTER_HASHTAGS,
} from "./constant";
import { generateTwitterShareLink } from "utils/index";
import { toast } from "react-toastify";
import { useWallet } from "hooks/useWallet";
import { UserProfile } from "declarations/backend/backend.did";
import { Link } from "react-router-dom";
import useGetDisplayAddress from "hooks/useGetDisplayAddress";
import queryClient from "utils/queryClient";
import { QUERY_KEYS } from "src/constants/query";

function Profile() {
  const { t } = useTranslation();
  const wallet = useWallet();
  const { data: userProfile, isFetching: isUserProfileLoading } = useGetUserProfile(wallet?.principalId);
  const { mutate: addUserProfile, isPending: isAddProfileLoading } = useAddUserProfile();
  const { mutate: updateProfile, isPending: isUpdateProfileLoading } = useUpdateUserProfile();
  const { data: isDeveloper, isFetching: isLoading } = useIsDeveloper();
  const { data: userRequest, isFetching: isUserRequestLoading } = useGetUserRequest();

  const [formActive, setFormActive] = useState(false);

  const getColor = (status: string) => {
    if (status === "approved") return "bg-primary";
    if (status === "rejected") return "bg-danger";
    if (status === "pending") return "bg-secondary";
  };

  const displayAddress = useGetDisplayAddress();
  //make reusable component in utils
  const copyToClipBoard = async () => {
    try {
      if (wallet === undefined) {
        toast.error("Failed to copy Principal Id");
        return;
      }

      await navigator.clipboard.writeText(wallet?.principalId);
      toast.success("Principal Id copied");
    } catch (err) {
      toast.error("Failed to copy Principal Id");
    }
  };

  const handleSubmit = (values: typeof USER_PROFILE_FORM_INITIAL) => {
    const payload: UserProfile = {
      bio: values.bio === "" ? [] : [values.bio],
      alias: values.alias,
      xHandle: values.xHandle === "" ? [] : [values.xHandle],
    };
    if (userProfile) {
      updateProfile(payload, {
        onSuccess: data => {
          toast.success("Profile Details updated");
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER_PROFILE],
          });
        },
        onError: err => {
          console.error(err);
          toast.error(err.message);
        },
      });
    } else {
      addUserProfile(payload, {
        onSuccess: () => toast.success("Profile Details added"),
        onError: err => {
          console.error(err);
          toast.error(err.message);
        },
      });
    }
  };

  const renderDeveloperStatus = () => {
    if (isLoading) return <Spinner size="sm" />;
    if (!isLoading && !isDeveloper) {
      if (!isUserRequestLoading && userRequest && userRequest?.length > 0) {
        if (Object.keys(userRequest[userRequest?.length - 1]?.status)[0] !== "approved") {
          return (
            <p
              className={`user_profile__summary__req-card__tag ${getColor(
                Object.keys(userRequest[userRequest?.length - 1].status).join(",")
              )} `}
            >
              {Object.keys(userRequest[userRequest?.length - 1].status).join(",")}
            </p>
          )
        }
      }
      else return (
        <div className="d-flex align-items-center profile__body__roles__button">
          <Button variant="outline">
            <Link
              to="/my-space/request/developer"
              className="profile__body__roles__button-link"
            >
              <i className="ri-code-box-fill"></i>
              {t("profile.requestDevAccess")}
            </Link>
          </Button>
        </div>
      );
    }
    if (isDeveloper) return (
      <a
        className="btn btn-secondary user_profile__summary__req-card__x-share"
        href={generateTwitterShareLink(
          TWITTER_SHARE_CONTENT,
          TWITTER_HASHTAGS
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="user_profile__summary__req-card__x-share__svg"
          >
            <path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"></path>
          </svg>
        </span>
        <span className="text-xs sub-title-color">Share</span>
      </a>

    )
  }

  if (isUserProfileLoading) return <PageLoader />;

  return (
    <div className="row">
      <div className="profile">
        <Formik
          initialValues={
            userProfile
              ? {
                bio: userProfile.bio[0] || "",
                alias: userProfile.alias,
                xHandle: userProfile.xHandle[0] || "",
              }
              : USER_PROFILE_FORM_INITIAL
          }
          validationSchema={USER_PROFILE_FORM_VALIDATION}
          onSubmit={handleSubmit}
        >
          {({ dirty, handleSubmit, handleReset }) => (
            <Form
              onSubmit={handleSubmit}
              noValidate
              className="add-profile__form"
            >
              <div className="profile__header">
                <div className="profile__header__img">
                  <img
                    className="rounded-circle d-inline me-2"
                    src={AvatarImg}
                    alt="profile-avatar"
                    width={144}
                  />
                </div>
                <div className="profile__header__button">
                  <Button
                    onClick={() => {
                      handleReset()
                      setFormActive(!formActive)
                    }}
                    variant="secondary"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>

              <div className="profile__body">
                <div className="profile__body__alias">
                  <h2 className="profile__body__alias__heading">{userProfile?.alias}</h2>
                </div>

                <div onClick={copyToClipBoard} className="profile__body__principal">
                  <i className="ri-file-copy-line"></i>
                  Principal Id {displayAddress}
                </div>

                <div className="profile__body__roles">
                  <div style={{ minHeight: "38px" }} className="d-flex align-items-center gap-2">
                    <p>{t("profile.roles")}</p>
                    <p className="d-flex gap-2">
                      <Badge bg="secondary">
                        <i className="ri-sparkling-fill"></i>
                        {t("common.creater")}
                      </Badge>
                      {isDeveloper && (
                        <Badge bg="success">
                          <i className="ri-code-box-fill"></i>
                          {t("common.developer")}
                        </Badge>
                      )}
                    </p>
                  </div>
                  {renderDeveloperStatus()}
                </div>
                <hr />
                <fieldset disabled>
                  <FormikInput
                    name="alias"
                    placeholder={t("profile.update.form.aliasPlaceHolder")}
                    label={
                      <Trans
                        i18nKey="profile.update.form.aliasLabel"
                        components={{
                          span: <span className="add-profile__form__label" />
                        }}
                      />
                    }
                  />
                </fieldset>
                <fieldset disabled={!formActive}>
                  <FormikInput
                    name="xHandle"
                    placeholder={t("profile.update.form.xHandlePlaceHolder")}
                    label={
                      <Trans
                        i18nKey="profile.update.form.xHandleLabel"
                        components={{
                          span: <span className="add-profile__form__label" />
                        }}
                      />
                    }
                  />
                  <FormikInput
                    name="bio"
                    as="textarea"
                    label={
                      <span className="add-profile__form__label">
                        {t("profile.update.form.bioLabel")}
                      </span>
                    }
                    placeholder={t("profile.update.form.bioPlaceHolder")}
                  />
                </fieldset>
              </div>
              {
                formActive && (
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      onClick={() => {
                        handleReset()
                        setFormActive(false)
                      }}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      label={"Save"}
                      isDisabled={
                        isAddProfileLoading || isUpdateProfileLoading || !dirty
                      }
                      isLoading={isAddProfileLoading || isUpdateProfileLoading}
                      type="submit"
                      variant="secondary"
                    />
                  </div>
                )
              }
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Profile;
