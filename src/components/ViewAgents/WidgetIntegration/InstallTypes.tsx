import { InputGroup, FormControl, Button } from "react-bootstrap";
import { copyToClipBoard } from "utils/index";
import { PACKAGE_INSTALL_EXAMPLE, PACKAGE_INSTALL_README, SCRIPT_INSTALL_EXAMPLE, SCRIPT_INSTALL_README } from "./constant";
import { useParams } from "react-router-dom";

export function PackageInstall() {
    const { id } = useParams();
    return (
        <div>
            <div>Choose and install package manager</div>
            <InputGroup className="mb-3 d-flex flex-column">
                {
                    PACKAGE_INSTALL_README.map((item) => (
                        <>
                            <label htmlFor={item.command}>{item.command}</label>
                            <div className="d-flex">
                                <FormControl name={item.command} value={item.installCommand} readOnly />
                                <Button
                                    onClick={() => copyToClipBoard(item.command, item.installCommand)}
                                    className="position-absolute end-0" variant="outline-secondary"
                                >
                                    <i className="ri-file-copy-line"></i>
                                </Button>
                            </div>
                        </>
                    ))
                }
                <div>Widget Integration</div>
                <label htmlFor="package-install-example">Example</label>
                <div className="d-flex">
                    <textarea readOnly name="package-install-example" value={PACKAGE_INSTALL_EXAMPLE(id ?? "", "LOGO_URL")} />
                    <Button
                        onClick={() => copyToClipBoard("Example", PACKAGE_INSTALL_EXAMPLE(id ?? "", "LOGO_URL"))}
                        className="position-absolute end-0" variant="outline-secondary"
                    >
                        <i className="ri-file-copy-line"></i>
                    </Button>
                </div>
            </InputGroup>
        </div>
    )
}

export function ScriptInstall() {
    const { id } = useParams();
    return (
        <div>
            <div>Add the following Script tag to your HTML page</div>
            <InputGroup className="mb-3 d-flex flex-column">
                {
                    SCRIPT_INSTALL_README.map((item) => (
                        <>
                            <label htmlFor={item.command}>{item.command}</label>
                            <div className="d-flex">
                                <FormControl name={item.command} value={item.installCommand} readOnly />
                                <Button
                                    onClick={() => copyToClipBoard(item.command, item.installCommand)}
                                    className="position-absolute end-0" variant="outline-secondary"
                                >
                                    <i className="ri-file-copy-line"></i>
                                </Button>
                            </div>
                        </>
                    ))
                }
                <div>Widget Integration</div>
                <label htmlFor="package-install-example">Example</label>
                <div className="d-flex">
                    <textarea readOnly name="package-install-example" value={SCRIPT_INSTALL_EXAMPLE(id ?? "", "LOGO_URL")} />
                    <Button
                        onClick={() => copyToClipBoard("Example", SCRIPT_INSTALL_EXAMPLE(id ?? "", "LOGO_URL"))}
                        className="position-absolute end-0" variant="outline-secondary"
                    >
                        <i className="ri-file-copy-line"></i>
                    </Button>
                </div>
            </InputGroup>
        </div>
    )
}

