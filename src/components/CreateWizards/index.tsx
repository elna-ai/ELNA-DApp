import PropTypes from "prop-types";
import MyWizards from "./MyWizards";
import PopularWizards from "./PopularWizards";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function CreateWizards({ isLoggedIn }: { isLoggedIn: boolean }) {
  useEffect(() => {
    const t = async () => {
      try {
        const data = await axios.get(
          "https://dkfbwoj9t05dn.cloudfront.net/info"
        );

        console.log(data);

        // "https://xweu5adnna.execute-api.eu-north-1.amazonaws.com/prod/info"
        // console.log(data);

        await axios.post("https://dkfbwoj9t05dn.cloudfront.net/create-index", {
          documents: [],
          index_name: "test",
        });
        toast.success("Uploaded successfully");
      } catch (e) {
        console.error(e);
      }
    };
    t();
  }, []);
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
