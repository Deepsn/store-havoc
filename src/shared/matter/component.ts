import { component } from "@rbxts/matter";
import type { Component } from "@rbxts/matter/lib/component";

export type CreatedComponent = <T extends object>(data?: T) => Component<T>;

export const MatterComponents = new Map<string, CreatedComponent>();

export function CreateComponent<T extends object>(
	name?: string,
	defaultData?: T,
) {
	const componentName = name ?? debug.info(2, "sl").join("@");
	const createdComponent = component<T>(componentName, defaultData);

	print("component name", componentName);

	MatterComponents.set(componentName, createdComponent as CreatedComponent);

	return createdComponent;
}
