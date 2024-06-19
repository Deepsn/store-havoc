import { ModelComponent } from "@/shared/components/model";
import type { SharedSystem } from "@/shared/matter/startMatter";
import { type World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";

function addCharacterModel(world: World) {
	for (const player of Players.GetPlayers()) {
		for (const [, character] of useEvent(player, "CharacterAdded")) {
			world.spawn(ModelComponent({ model: character }));
		}
	}
}

export = {
	system: addCharacterModel,
} as SharedSystem;
