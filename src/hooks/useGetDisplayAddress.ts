import { useEffect, useState } from "react";
import { useWallet } from "./useWallet";

const useGetDisplayAddress = () => {
  const [address, setAddress] = useState("");
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet?.principalId) return;

    const firstPart = wallet?.principalId?.substring(0, 5);
    const lastPart = wallet?.principalId?.substring(
      wallet.principalId.length - 3
    );
    setAddress(`${firstPart}...${lastPart}`);
  }, [wallet?.principalId]);

  return address;
};

export default useGetDisplayAddress;
