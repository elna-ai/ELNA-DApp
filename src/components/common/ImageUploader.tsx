import { useFormikContext } from "formik";
import { InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import classNames from "classnames";

type ImageUploadShape = "circle" | "rectangle";

type ImageUploaderProps<T> = {
  id: string;
  value: { fileName: string; image: string };
  name: keyof T;
  shapeType: ImageUploadShape;
  maxSize: number;
  height: number;
  width: number;
};
function ImageUploader<T>({ id, value, name, shapeType, maxSize, height, width }: ImageUploaderProps<T>) {
  const { setFieldValue, errors, setFieldError } = useFormikContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size <= maxSize * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        var image = new Image();
        image.src = base64String;

        image.onload = function () {
          if (image.height === height && image.width === width) {
            setFieldValue(name as string, {
              fileName: file.name,
              image: base64String,
            });
          } else {
            setFieldError(`${name as string}.image`, `Height and Width must not exceed ${height} and ${width} respectively.`);
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      toast.error(
        `Image size exceeds ${maxSize} KB. Please upload a smaller image.`
      );
    }
  };

  return (
    <InputGroup>
      <div
        className={classNames({
          "avatar-image-rectangle-wrapper": shapeType === "rectangle",
          "avatar-image-wrapper": shapeType === "circle",
        })}
      >
        <input
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          hidden
          id={id}
        />
        <label
          className={classNames("custom-avatar-parent btn bg-dark d-flex align-items-center justify-content-center", {
            "avatar-image-rectangle": shapeType === "rectangle",
            "avatar-image": shapeType === "circle",
          })}
          htmlFor={id}
        >
          {value.image ? (
            <img
              src={value.image}
              className={classNames({
                "avatar-image-rectangle": shapeType === "rectangle",
                "avatar-image": shapeType === "circle",
              })}
            />
          ) : (
            <i className="ri-upload-2-fill custom-avatar-parent__child text-white"></i>
          )}
        </label>
        <span style={{ color: "red" }}>{(errors?.[name] as any)?.image}</span>
      </div>
    </InputGroup>
  );
}

export default ImageUploader;
