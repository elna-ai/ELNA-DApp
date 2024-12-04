import { useFormikContext } from "formik";
import { InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";

type ImageUploaderProps<T> = {
  id: string;
  value: { fileName: string; image: string };
  name: keyof T;
  maxSize: number;
};
function ImageUploader<T>({ id, value, name, maxSize }: ImageUploaderProps<T>) {
  const { setFieldValue, errors } = useFormikContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size <= maxSize * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setFieldValue(name as string, {
          fileName: file.name,
          image: base64String,
        });
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
      <div className="avatar-image-wrapper">
        <input
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          hidden
          id={id}
        />
        <label
          className="custom-avatar-parent btn avatar-image bg-dark d-flex align-items-center justify-content-center"
          htmlFor={id}
        >
          {value.image ? (
            <img
              src={value.image}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "100%",
              }}
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
