import PropTypes from "prop-types";
import MyWizards from "./MyWizards";
import PopularWizards from "./PopularWizards";

function CreateWizards({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="w-100">
      {isLoggedIn && <MyWizards />}
      <PopularWizards />
    </div>
  );
}

CreateWizards.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default CreateWizards;
