import { MatterComponents } from "@/shared/matter/component";
import { useStartup } from "@/shared/matter/hooks/useStartup";
import { remotes } from "@/shared/remotes";
import { type AnyComponent, type AnyEntity, type World, useEvent } from "@rbxts/matter";
import type { ComponentCtor } from "@rbxts/matter/lib/component";
import Object from "@rbxts/object-utils";
import type { RootSystem } from "../runtime.client";

const localEntityMap = new Map<string, AnyEntity>();

function ReceiveReplication(world: World) {
	function debugPrint(...messages: unknown[]) {
		print(...messages);
	}

	for (const [, payload] of useEvent(remotes.matter.replicate, remotes.matter.replicate)) {
		for (const [serverEntityId, components] of payload) {
			let clientEntityId = localEntityMap.get(serverEntityId);

			if (clientEntityId && next(components) === undefined) {
				world.despawn(clientEntityId);
				localEntityMap.delete(serverEntityId);

				debugPrint(`Entity despawned ${clientEntityId} (${serverEntityId})`);

				continue;
			}

			const componentsToAdd = new Map<string, AnyComponent>();
			const componentsToRemove = new Map<string, ComponentCtor>();

			for (const [id, { data }] of components) {
				const { newComponent } = MatterComponents.get(id) ?? {};

				if (!newComponent) {
					continue;
				}

				if (componentsToAdd.has(id) || componentsToRemove.has(id)) {
					warn("Component was already added to list");
					continue;
				}

				if (data) {
					componentsToAdd.set(id, newComponent(data));
				} else {
					componentsToRemove.set(id, newComponent);
				}
			}

			if (!clientEntityId) {
				clientEntityId = world.spawn(...Object.values(componentsToAdd));

				localEntityMap.set(serverEntityId, clientEntityId);

				debugPrint(`Spawned entity ${clientEntityId} (${serverEntityId}) with ${Object.keys(componentsToAdd).join()}`);
			} else {
				if (componentsToAdd.size() > 0) {
					world.insert(clientEntityId, ...Object.values(componentsToAdd));
				}

				if (componentsToRemove.size() > 0) {
					world.remove(clientEntityId, ...Object.values(componentsToRemove));
				}

				const componentsNamesToAdd = Object.keys(componentsToAdd);
				const componentsNamesToRemove = Object.keys(componentsToRemove);

				debugPrint(
					`Updated entity ${clientEntityId} (${serverEntityId}) with ${componentsNamesToAdd.join()} and removed ${componentsNamesToRemove.join()}`,
				);
			}
		}
	}

	if (useStartup()) {
		debugPrint("Started receiving replication");
		remotes.matter.start.fire();
	}
}

export = {
	system: ReceiveReplication,
	priority: math.huge,
} as RootSystem;
