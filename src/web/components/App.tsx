import * as React from "react";
import { AppStateProvider } from "../domain/AppState";
import { SplitView } from "./SplitView";
import { ActionStateProvider } from "../domain/ActionState";
import { ConfigStateProvider } from "../domain/ConfigState";

export interface AppProps
{
  configId?: string;
  primaryEntityLogicalName?: string;
  appId?: string;
  primaryDataIds?: Array<string>;
}

export const App: React.FC<AppProps> = (props) => {
  return (
    <AppStateProvider primaryDataIds={props.primaryDataIds}>
      <ActionStateProvider>
        <ConfigStateProvider appId={props.appId} configId={props.configId} primaryEntityLogicalName={props.primaryEntityLogicalName}>
          <SplitView primaryDataIds={props.primaryDataIds} />
        </ConfigStateProvider>
      </ActionStateProvider>
    </AppStateProvider>
  );
};