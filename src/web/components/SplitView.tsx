import * as React from "react";
import { Modal, ProgressBar } from "react-bootstrap";
import { Board } from "./Board";
import { SideBySideForm } from "./SideBySideForm";
import { NotificationList } from "./NotificationList";
import { UserInputModal } from "./UserInputModalProps";
import { ExternalForm } from "./ExternalForm";
import { useActionState, DisplayType } from "../domain/ActionState";
import { useConfigState } from "../domain/ConfigState";
import { ConfigSelector } from "./ConfigSelector";

interface SplitViewProps { }

export const SplitView = (props: SplitViewProps) => {
    const actionState = useActionState();
    const configState = useConfigState();

    return (<>
        <Modal onHide={() => {}} show={!!actionState.progressText} size="lg">
            <Modal.Header>
                <Modal.Title>Loading...</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div>
                    <div style={{textAlign: "center", width: "100%", fontSize: "large"}}>{actionState.progressText}</div>
                    <br />
                    <ProgressBar animated now={100} />
                </div>
            </Modal.Body>
        </Modal>
        { actionState.flyOutForm && <ExternalForm /> }
        <ConfigSelector show={actionState.configSelectorDisplayState || !configState.configId} />
        <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#efefef" }}>
            <div style={actionState.selectedRecord ? { minWidth: "600px", resize: "horizontal", overflow: "auto"} : { width: "100%" }}>
                { configState.configId && <Board /> }
            </div>
            { !!actionState.selectedRecord && actionState.selectedRecordDisplayType === DisplayType.recordForm &&
                <div style={{minWidth: "400px", borderLeft: "1px solid", flex: "1" }}>
                    <SideBySideForm />
                </div>
            }
            { !!actionState.selectedRecord && actionState.selectedRecordDisplayType === DisplayType.notifications &&
                <div style={{minWidth: "400px", borderLeft: "1px solid", flex: "1" }}>
                    <NotificationList />
                </div>
            }
        </div>
        </>
    );
};