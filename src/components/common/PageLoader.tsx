import ElnaSvg from "images/BrandSm.svg?react"

function PageLoader() {

  return (
    <div className="loader-spin m-auto" style={{ width: "fit-content" }} >
      <div className="loader-pulse">
        <ElnaSvg style={{ width: "6rem" }} />
      </div>
    </div>
  );
}

export default PageLoader;