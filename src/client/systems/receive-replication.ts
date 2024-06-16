import { MatterComponents } from "@/shared/matter/component";
import { useStartup } from "@/shared/matter/hooks/useStartup";
import { remotes } from "@/shared/remotes";
import { type AnyComponent, type AnyEntity, type World, useEvent } from "@rbxts/matter";
import type { ComponentCtor } from "@rbxts/matter/lib/component";
import type { ClientState, RootSystem } from "../runtime.client";

const localEntityMap = new Map<string, AnyEntity>();

function ReceiveReplication(world: World, state: ClientState) {
	function debugPrint(...messages: unknown[]) {
		print(...messages);
	}

	for (const [, payload] of useEvent(remotes.matter.replicate, remotes.matter.replicate)) {
		debugPrint("Received replication from server", payload);

		for (const [serverEntityId, components] of payload) {
			let clientEntityId = localEntityMap.get(serverEntityId);

			if (clientEntityId && next(components) === undefined) {
				world.despawn(clientEntityId);
				localEntityMap.delete(serverEntityId);

				debugPrint(`Entity despawned ${clientEntityId}`);

				continue;
			}

			const componentsToAdd = new Array<AnyComponent>();
			const componentsToRemove = new Array<ComponentCtor>();

			for (const [id, data] of components) {
				const componentData = MatterComponents.get(id);

				if (!componentData) {
					continue;
				}

				const { newComponent } = componentData;

				if (data) {
					componentsToAdd.push(newComponent(data));
					print(id, componentData, MatterComponents, MatterComponents.get(id));
				} else {
					componentsToRemove.push(newComponent);
				}
			}

			if (!clientEntityId) {
				clientEntityId = world.spawn(...componentsToAdd);

				localEntityMap.set(serverEntityId, clientEntityId);

				debugPrint(`Spawned entity ${clientEntityId}(${serverEntityId}) with ${componentsToAdd.join()}`);
			} else {
				if (componentsToAdd.size() > 0) {
					world.insert(clientEntityId, ...componentsToAdd);
				}

				if (componentsToRemove.size() > 0) {
					world.remove(clientEntityId, ...componentsToRemove);
				}

				debugPrint(
					`Updated entity ${clientEntityId}(${serverEntityId}) with ${componentsToAdd.join()} and removed ${componentsToRemove.join()}`,
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
