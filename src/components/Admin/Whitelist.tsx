import { useEffect, useState } from "react";

import { Principal } from "@dfinity/principal";
import { backend } from "declarations/backend";
import { useWallet } from "hooks/useWallet";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";

import PageLoader from "components/common/PageLoader";

function WhitelistUsers() {
  const [whitelistedUsers, setWhitelistedUsers] = useState<Principal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const wallet = useWallet();

  useEffect(() => {
    const getWhitelistedUsers = async () => {
      if (wallet === undefined) return;

      try {
        const data = await backend.getWhitelistedUser(wallet?.principalId);
        setWhitelistedUsers(data);
      } catch (e) {
        console.error(e);
        toast.error("Couldn't fetch whitelisted users");
      } finally {
        setIsLoading(false);
      }
    };

    getWhitelistedUsers();
  }, [wallet?.principalId]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="admin__whitelist__wrapper">
      {whitelistedUsers.map(principal => (
        <div className="admin__whitelist__item">
          <span>{principal.toText()}</span>
          <Button variant="danger">Delete</Button>
        </div>
      ))}
    </div>
  );
}

export default WhitelistUsers;
