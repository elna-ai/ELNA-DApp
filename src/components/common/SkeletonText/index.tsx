import React from "react";
import css from "./Style.module.scss";
export const SkeletonText: React.FC<{ style?: React.CSSProperties }> = ({
  style = {},
}) => {
  return <div className={css.skeleton_text} style={style}></div>;
};
