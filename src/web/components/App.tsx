import * as React from "react";
import { AppStateProvider } from "../domain/AppState";
import { SplitView } from "./SplitView";
import { ActionStateProvider } from "../domain/ActionState";
import { ConfigStateProvider } from "../domain/ConfigState";

export interface AppProps
{
  configId: string;
  appId: string;
  retrievePrimaryData: (columns: Array<string>) => Promise<Array<any>>;
}

export const App: React.FC<AppProps> = (props) => {
  return (
    <AppStateProvider>
      <ActionStateProvider>
        <ConfigStateProvider appId={props.appId} configId={props.configId}>
          <SplitView />
        </ConfigStateProvider>
      </ActionStateProvider>
    </AppStateProvider>
  );
};