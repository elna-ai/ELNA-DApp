import PropTypes from "prop-types";
import MyWizards from "./MyWizards";
import PopularWizards from "./PopularWizards";

function CreateWizards() {
  return (
    <div className="w-100">
      <MyWizards />
      <PopularWizards />
    </div>
  );
}

export default CreateWizards;
