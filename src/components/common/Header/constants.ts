import { t } from "i18next";

import icp from "images/icp.png";
import soticWallet from "images/soticWallet.png";
import InfinityLogo from "images/InfinityLogo.png";
import PlugIcon from "images/plug.png";
import astroMeLogo from "images/astroMe.jpg";
import nfidLogo from "images/nfid.png";
import metaMaskLogo from "images/metaMaskWallet.svg";

// TODO: Figure out why t() is not working
export const WALLET_LIST = [
  { name: t("signIn.walletList.dfinity"), icon: icp, id: "dfinity" },
  { name: t("signIn.walletList.stoic"), icon: soticWallet, id: "stoic" },
  { name: t("signIn.walletList.plug"), icon: PlugIcon, id: "plug" },
  { name: t("signIn.walletList.astrox"), icon: astroMeLogo, id: "astrox" },
  {
    name: t("signIn.walletList.bitfinity"),
    icon: InfinityLogo,
    id: "bitfinity",
  },
  {
    id: "nfid",
    name: t("signIn.walletList.nfid"),
    icon: nfidLogo,
  },
  {
    id: "metamask",
    name: t("signIn.walletList.metamask"),
    icon: metaMaskLogo,
  },
];
