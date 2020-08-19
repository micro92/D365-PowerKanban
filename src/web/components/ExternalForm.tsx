import * as React from "react";
import { useAppContext } from "../domain/AppState";

import { fetchData, refresh } from "../domain/fetchData";
import { UserInputModal } from "./UserInputModalProps";
import { useActionContext } from "../domain/ActionState";
import { FlyOutField } from "../domain/FlyOutForm";
import { TextField } from "@fluentui/react/lib/TextField";

interface ExternalFormProps {
}

export const ExternalForm = (props: ExternalFormProps) => {
    const [ actionState, actionDispatch ] = useActionContext();
    const [ formData, setFormData ] = React.useState({} as any);

    const noCallBack = () => {
        actionState.flyOutForm.resolve({
            cancelled: true
        });
    };

    const yesCallBack = () => {
        actionState.flyOutForm.resolve({
            cancelled: false,
            values: formData
        });
    };

    const hideDialog = () => {
        actionDispatch({ type: "setFlyOutForm", payload: undefined });
    };

    const onFieldChange = (e: any) => {
        const value = e.target.value;
        const id = e.target.id;

        setFormData({...formData, [id]: value });
    };

    const formField = (fieldId: string, field: FlyOutField) => (
        <TextField key={fieldId} id={fieldId} description={field.subtext} required={field.required} multiline={field.rows && field.rows > 1} rows={field.rows ?? 1} type={field.type} label={field.label} placeholder={field.placeholder} onChange={onFieldChange} />
    );

    return (
        <UserInputModal okButtonDisabled={!Object.keys(actionState.flyOutForm.fields).every(fieldId => !actionState.flyOutForm.fields[fieldId].required || !!formData[fieldId])} noCallBack={noCallBack} yesCallBack={yesCallBack} finally={hideDialog} title={actionState.flyOutForm?.title} show={!!actionState.flyOutForm}>
            {Object.keys(actionState.flyOutForm.fields).map(fieldId => formField(fieldId, actionState.flyOutForm.fields[fieldId]))}
        </UserInputModal>
    );
};