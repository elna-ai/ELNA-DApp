import LoadingButton from "components/common/LoadingButton";
import PageLoader from "components/common/PageLoader";
import { useUserStore } from "stores/useUser";
import NoLogin from "./NoLogin";
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
import AvatarImg from "images/avatar.png";
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
  const isUserLoggedIn = useUserStore(state => state.isUserLoggedIn);
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

  if (!isUserLoggedIn) {
    return <NoLogin />;
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
                  <LoadingButton
                    label={"Edit Profile"}
                    isDisabled={
                      isAddProfileLoading || isUpdateProfileLoading || !dirty
                    }
                    isLoading={isAddProfileLoading || isUpdateProfileLoading}
                    type="submit"
                    variant="secondary"
                  />
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
                  <div className="d-flex align-items-center gap-2">
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

                  <div className="d-flex align-items-center profile__body__roles__button">
                    {!isDeveloper && (
                      <Button variant="outline">
                        <Link
                          to="/my-space/request/developer"
                          className="profile__body__roles__button-link"
                        >
                          <i className="ri-code-box-fill"></i>
                          {t("profile.requestDevAccess")}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                <hr />


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
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Profile;
