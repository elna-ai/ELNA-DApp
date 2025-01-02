import { InputGroup, FormControl, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const copyToClipBoard = async (tag: string, text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(`${tag} copied`);
    } catch (err) {
        toast.error(`Failed to copy ${tag}`);
    }
};

export default function PackageInstall() {
    return (
        <div>
            <div>Choose and install package manager</div>
            <InputGroup className="mb-3 d-flex flex-column">
                <label htmlFor="basic-url">labell</label>
                <div className="d-flex">
                    <FormControl name="basic-url" value={"yabadabadoo"} readOnly />
                    <Button
                        onClick={() => copyToClipBoard("yabadabadoo", "yabadabadeee")}
                        className="position-absolute end-0" variant="outline-secondary"
                    >
                        <i className="ri-file-copy-line"></i>
                    </Button>
                </div>
            </InputGroup>
            <div>Widget Integration</div>

        </div>
    )
}
