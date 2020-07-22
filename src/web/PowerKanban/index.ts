import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "../components/App";
import { ParseSearch } from "../domain/ParseSearch";
import * as WebApiClient from "xrm-webapi-client";
import { library } from "@fortawesome/fontawesome-svg-core"
import { faTh, faBell, faBellSlash, faEye, faEyeSlash, faWindowClose, faWindowMaximize, faPlus, faPlusSquare, faAngleDoubleRight, faCircle, faSync, faSearch } from "@fortawesome/free-solid-svg-icons"
 
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class PowerKanban implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;
	private _isInitialized = false;

	/**
	 * Empty constructor.
	 */
	constructor()
	{
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._notifyOutputChanged = notifyOutputChanged;
		this._context = context;
		this._container = container;

		library.add(faTh, faBell, faBellSlash, faEye, faEyeSlash, faWindowClose, faWindowMaximize, faPlus, faPlusSquare, faAngleDoubleRight, faCircle, faSync, faSearch);
	}

	private addMissingColumns(columns: Array<string>) {
		columns.forEach(c => {
			if (!this._context.parameters.primaryDataSet.columns.find(f => f.name === c)) {
				this._context.parameters.primaryDataSet.addColumn(c);
			}
		});
	}

	private normalizeRecord(record: any) {
		return Object.keys(record)
			.reduce((all, cur) => {
				// Handle lookups
				if (record[cur].reference != null) {
					all[`_${cur}_value`] = record[cur].reference.id;
					all[`_${cur}_value@OData.Community.Display.V1.FormattedValue`] = record[cur].reference.name;
					all[`_${cur}_value@Microsoft.Dynamics.CRM.lookuplogicalname`] = record[cur].reference.etn;
				}
				// Handle optionsets
				else if(record[cur].valueString != null) {
					all[cur] = parseInt(record[cur].valueString);
					all[`${cur}@OData.Community.Display.V1.FormattedValue`] = record[cur].label;
				}
				// Handle formatted data other than option sets
				else if (record[cur].formatted != null) {
					all[`${cur}@OData.Community.Display.V1.FormattedValue`] = record[cur].formatted;
				}
				// Handle all others
				else if (record[cur].value != null) {
					all[cur] = record[cur].value;
				}
			}, {} as any);
	}

	private async retrievePrimaryData(columns: Array<string>): Promise<Array<any>>
	{
		return new Promise((resolve, reject) => {
			if (!this._context.parameters.primaryDataSet.paging || this._context.parameters.primaryDataSet.loading) {
				reject(new Error("Data set is not ready"));
			}

			this.addMissingColumns(columns);

			this._context.parameters.primaryDataSet.paging.setPageSize(5000);
			this._context.parameters.primaryDataSet.paging.reset();

			while (this._context.parameters.primaryDataSet.paging.hasNextPage) {
				this._context.parameters.primaryDataSet.paging.loadNextPage();
			}

			const data = Object.keys(this._context.parameters.primaryDataSet.records)
				.map(k => (this._context.parameters.primaryDataSet.records[k] as any)._record.fields)
				.map(r => this.normalizeRecord(r));

			resolve(data);
		});
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public async updateView(context: ComponentFramework.Context<IInputs>): Promise<void>
	{
		if (this._isInitialized) {
			return;
		}

		const search = ParseSearch();
		const configName = this._context.parameters.configName.raw;

		const config = !configName ? null : await WebApiClient.Retrieve({ entityName: "oss_powerkanbanconfig", alternateKey:  [ { property: "oss_uniquename", value: configName } ], queryParams: "?$select=oss_powerkanbanconfigid" });

		ReactDOM.render(
			React.createElement(App, {
				appId: search["appid"] ?? search["app"] ?? "d365default",
				primaryEntityLogicalName: this._context.parameters.primaryDataSet.getTargetEntityType(),
				configId: config ? config.oss_powerkanbanconfigid : null,
				retrievePrimaryData: this.retrievePrimaryData 
			}),
			this._container
		);

		this._isInitialized = true;
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this._container);
	}

}