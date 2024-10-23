import LoadingButton from "components/common/LoadingButton";
import PageLoader from "components/common/PageLoader";
import { Formik } from "formik";
import {
  useAddUserProfile,
  useGetUserProfile,
  useUpdateUserProfile,
} from "hooks/reactQuery/useUser";
import { Button, Form } from "react-bootstrap";
import FormikInput from "components/common/FormikInput";
import { Trans, useTranslation } from "react-i18next";
import creatorIcon from "src/images/creator.svg";
import {
  USER_PROFILE_FORM_INITIAL,
  USER_PROFILE_FORM_VALIDATION,
} from "./constants";
import { toast } from "react-toastify";
import { useWallet } from "hooks/useWallet";
import { UserProfile } from "declarations/backend/backend.did";
import queryClient from "utils/queryClient";
import { QUERY_KEYS } from "src/constants/query";

function AddDetails() {
  const { t } = useTranslation();
  const wallet = useWallet();
  const { data: userProfile, isFetching: isUserProfileLoading } =
    useGetUserProfile(wallet?.principalId);
  const { mutate: addUserProfile, isPending: isAddProfileLoading } =
    useAddUserProfile();
  const { mutate: updateProfile, isPending: isUpdateProfileLoading } =
    useUpdateUserProfile();

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
              <Form onSubmit={handleSubmit} noValidate>
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

export default AddDetails;
