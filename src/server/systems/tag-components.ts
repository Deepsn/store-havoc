import { type ComponentCreator, MatterComponents } from "@/shared/matter/component";
import { useStartup } from "@/shared/matter/hooks/useStartup";
import type { SharedSystem } from "@/shared/matter/startMatter";
import type { AnyEntity, World } from "@rbxts/matter";
import { CollectionService } from "@rbxts/services";

function TagComponents(world: World) {
	const spawnComponent = (instance: Instance, component: ComponentCreator) => {
		const id = world.spawn(component());

		instance.SetAttribute("entityId", id);
	};

	const despawnComponent = (instance: Instance) => {
		const id = instance.GetAttribute("entityId") as AnyEntity | undefined;

		if (!id) return;

		world.despawn(id);
	};

	if (useStartup()) {
		for (const [name, { newComponent }] of MatterComponents) {
			for (const instance of CollectionService.GetTagged(name)) {
				spawnComponent(instance, newComponent);
			}

			CollectionService.GetInstanceAddedSignal(name).Connect((instance) => spawnComponent(instance, newComponent));

			CollectionService.GetInstanceRemovedSignal(name).Connect(despawnComponent);
		}
	}
}

export = {
	system: TagComponents,
	priority: math.huge,
} satisfies SharedSystem;
