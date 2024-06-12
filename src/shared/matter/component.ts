import { component } from "@rbxts/matter";
import type { Component } from "@rbxts/matter/lib/component";

export type ComponentCreator = <T extends object>(data?: T) => Component<T>;

interface ComponentSettings {
	name?: string;
	replicable?: boolean;
}

interface ComponentData {
	newComponent: ComponentCreator;
	settings: ComponentSettings;
}

export const MatterComponents = new Map<string, ComponentData>();

export function CreateComponent<T extends object>(
	settings?: ComponentSettings & T,
) {
	const { name, replicable } = settings ?? {};
	const defaultData = { ...settings, name: undefined, replicatable: undefined };

	const componentName = name ?? debug.info(2, "sl").join("@");
	const componentCreator = component<T>(componentName, defaultData as T);

	print("component name", componentName);
	print("replicable?", replicable);

	MatterComponents.set(componentName, {
		newComponent: componentCreator as ComponentCreator,
		settings: { replicable, name },
	});

	return componentCreator;
}
