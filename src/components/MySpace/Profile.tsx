import LoadingButton from "components/common/LoadingButton";
import PageLoader from "components/common/PageLoader";
import { Formik } from "formik";
import {
  useAddUserProfile,
  useGetUserProfile,
  useUpdateUserProfile,
} from "hooks/reactQuery/useUser";
import { useIsDeveloper } from "hooks/reactQuery/useDeveloper";
import { Button, Form, Badge } from "react-bootstrap";
import FormikInput from "components/common/FormikInput";
import { Trans, useTranslation } from "react-i18next";
import creatorIcon from "src/images/creator.svg";
import {
  USER_PROFILE_FORM_INITIAL,
  USER_PROFILE_FORM_VALIDATION,
} from "./constant";
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

  if (isUserProfileLoading) return <PageLoader />;

  return (
    <div className="row justify-content-center">
      <div className="add-profile">
        <div className="col-md-12">
          <div
            onClick={copyToClipBoard}
            className="d-flex"
          >
            <i className="ri-file-copy-line"></i>
            Principal Id {displayAddress}
          </div>
          <div className="d-flex align-items-center gap-2">
            <p>{t("profile.roles")}</p>
            <p className="d-flex gap-2">
              <Badge bg="secondary">{t("common.chatter")}</Badge>
              {isDeveloper && <Badge bg="success">{t("common.developer")}</Badge>}
            </p>
          </div>
          {!isDeveloper && (
            <Button variant="secondary">
              <Link to="request/developer">{t("profile.requestDevAccess")}</Link>
            </Button>
          )}
          <div className="add-profile__header">
            <div className="add-profile__header__icon">
              <img
                src={creatorIcon}
                className="add-profile__header__icon-img"
                alt="Creator Icon"
              />
            </div>
            <h3 className="add-profile__header__title">
              {t("profile.add.title")}
            </h3>
            <p className="add-profile__header_desc">
              {t("profile.add.description")}
            </p>
          </div>
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
                <FormikInput
                  name="alias"
                  placeholder={t("profile.add.form.aliasPlaceHolder")}
                  label={
                    <Trans
                      i18nKey="profile.add.form.aliasLabel"
                      components={{
                        span: <span className="add-profile__form__label" />,
                        div: <div className="add-profile__form__label-desc" />,
                      }}
                    />
                  }
                />
                <div className="add-profile__form__principalid">
                  <span className="add-profile__form__label">
                    {t("profile.add.form.principalIdLabel")}
                  </span>
                  <div className="add-profile__form__principalid__input">
                    <p className="fw-semibold mb-0">{wallet?.principalId}</p>
                  </div>
                </div>
                <FormikInput
                  name="xHandle"
                  placeholder={t("profile.add.form.xHandlePlaceHolder")}
                  label={
                    <Trans
                      i18nKey="profile.add.form.xHandleLabel"
                      components={{
                        span: <span className="add-profile__form__label" />,
                        div: <div className="add-profile__form__label-desc" />,
                      }}
                    />
                  }
                />
                <FormikInput
                  name="bio"
                  as="textarea"
                  label={
                    <span className="add-profile__form__label">
                      {t("profile.add.form.bioLabel")}
                    </span>
                  }
                  placeholder={t("profile.add.form.bioPlaceHolder")}
                />
                <div className="d-flex gap-3 mt-4 flex-row-reverse">
                  <LoadingButton
                    type="submit"
                    label={
                      userProfile
                        ? t("common.update", { entity: "" })
                        : t("common.ok")
                    }
                    isDisabled={!dirty}
                    isLoading={isAddProfileLoading || isUpdateProfileLoading}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    disabled={isAddProfileLoading || isUpdateProfileLoading}
                  >
                    {t("common.clear")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Profile;
