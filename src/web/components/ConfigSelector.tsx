import * as React from "react";
import { useAppContext } from "../domain/AppState";
import { Button, Form } from "react-bootstrap";

import { fetchData, refresh } from "../domain/fetchData";
import { UserInputModal } from "./UserInputModalProps";
import { useActionContext } from "../domain/ActionState";
import { useConfigContext } from "../domain/ConfigState";
import * as WebApiClient from "xrm-webapi-client";
import { formatGuid } from "../domain/GuidFormatter";

interface ConfigSelectorProps {
    show: boolean;
}

export const ConfigSelector = (props: ConfigSelectorProps) => {
    const [ actionState, actionDispatch ] = useActionContext();
    const [ configState, configDispatch ] = useConfigContext();
    const [ configId, setConfigId ] = React.useState(undefined);
    const [ configs, setConfigs ] = React.useState([]);
    const [ makeDefault, setMakeDefault ] = React.useState(false);

    const yesCallBack = async() => {
        const id = configId;

        if (makeDefault) {
            const userId = formatGuid(Xrm.Page.context.getUserId());
            await WebApiClient.Update({ entityName: "systemuser", entityId: userId, entity: { oss_defaultboardid: id } });
        }

        configDispatch({ type: "setConfigId", payload: id });
    };

    const hideDialog = () => {
        actionDispatch({ type: "setConfigSelectorDisplayState", payload: false });
    };

    React.useEffect(() => {
        const fetchConfigs = async() => {
            const { value: data }: { value: Array<any> } = await WebApiClient.Retrieve({entityName: "oss_powerkanbanconfig", queryParams: `?$select=oss_uniquename,oss_value,oss_powerkanbanconfigid&$filter=oss_entitylogicalname eq '${configState.primaryEntityLogicalName}'&$orderby=oss_uniquename` });
            setConfigs(data);
        };

        fetchConfigs();
    }, []);

    const onSelection = (e: any) => {
        setConfigId(e.target.value);
        setMakeDefault(false);
    };

    const onMakeDefault = (e: any) => {
        setMakeDefault(e.target.value);
    };

    return (
        <UserInputModal okButtonDisabled={!configId} noCallBack={() => {}} yesCallBack={yesCallBack} finally={hideDialog} title={"Choose Board"} show={props.show}>
            <Form.Group controlId="configSelector">
                <Form.Label>Select a board to load</Form.Label>
                <Form.Control as="select" onChange={onSelection}>
                    <option value=""></option>
                    { configs.map(c => <option key={c.oss_powerkanbanconfigid} value={c.oss_powerkanbanconfigid}>{c.oss_uniquename}</option>) }
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="setDefaultCheckbox">
                <Form.Check checked={makeDefault} onChange={onMakeDefault} type="checkbox" label="Make this my default board" />
            </Form.Group>
        </UserInputModal>
    );
};