import { MatterComponents } from "@/shared/matter/component";
import { remotes } from "@/shared/remotes";
import { type AnyComponent, type World, useEvent } from "@rbxts/matter";
import type { RootSystem } from "../runtime.server";

type ReplicationPayload = Map<string, Map<string, { data: AnyComponent | undefined }>>;

function ReplicateComponents(world: World) {
	for (const [, { newComponent, settings }] of MatterComponents) {
		if (!settings.replicable) continue;

		const componentId = tostring(newComponent);

		for (const [, player] of useEvent(remotes.matter.start, remotes.matter.start)) {
			const payload: ReplicationPayload = new Map();

			for (const [entityId, componentData] of world.query(newComponent)) {
				const key = tostring(entityId);
				const components = payload.get(key) ?? new Map();

				components.set(componentId, { data: componentData });

				payload.set(key, components);
			}

			print(`Sending initial payload to player ${player.Name}`, payload);
			remotes.matter.replicate.fire(player, payload);
		}

		const changes: ReplicationPayload = new Map();

		for (const [entityId, record] of world.queryChanged(newComponent)) {
			const key = tostring(entityId);
			const components = changes.get(key) ?? new Map();

			if (world.contains(entityId)) {
				components.set(componentId, { data: record.new });
			}

			changes.set(key, components);
		}

		if (next(changes).size() > 0) {
			remotes.matter.replicate.fireAll(changes);
		}
	}
}

export = {
	system: ReplicateComponents,
	priority: math.huge,
} satisfies RootSystem;
