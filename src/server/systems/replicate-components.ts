import type { CreatedComponent } from "@/shared/matter/component";
import { remotes } from "@/shared/remotes";
import { type AnyComponent, type World, useEvent } from "@rbxts/matter";
import type { RootSystem } from "../runtime.server";

const REPLICATED_COMPONENTS = [] as CreatedComponent[];

function ReplicateComponents(world: World) {
	for (const [, player] of useEvent(
		remotes.matter.start,
		remotes.matter.start,
	)) {
		const payload = new Map<string, Map<string, AnyComponent>>();

		for (const component of REPLICATED_COMPONENTS) {
			for (const [entityId, componentData] of world.query(component)) {
				const key = tostring(entityId);
				const components = payload.get(key) ?? new Map();
				const componentId = tostring(component);

				components.set(componentId, componentData);

				payload.set(key, components);
			}
		}

		print(`Sending initial payload to player ${player.Name}`, payload);
		remotes.matter.replicate.fire(player, payload);
	}

	const payload = new Map<string, Map<string, AnyComponent>>();

	for (const component of REPLICATED_COMPONENTS) {
		for (const [entityId, componentData] of world.queryChanged(component)) {
			const key = tostring(entityId);
			const components = payload.get(key) ?? new Map();
			const componentId = tostring(component);

			if (world.contains(entityId) && componentData.new) {
				components.set(componentId, componentData.new);
			}

			payload.set(key, components);
		}
	}

	if (next(payload).size() > 0) {
		remotes.matter.replicate.fireAll(payload);
	}
}

export = {
	system: ReplicateComponents,
	priority: math.huge,
} satisfies RootSystem;
