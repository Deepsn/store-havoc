import { startMatter } from "@/shared/matter/startMatter";
import type { System } from "@rbxts/matter";
import { ReplicatedStorage } from "@rbxts/services";

declare const script: {
	Parent: { systems: Folder } & Folder;
} & LuaSourceContainer;

// biome-ignore lint/suspicious/noEmptyInterface: no serverstate for now
export interface ServerState {}

const serverState: ServerState = {};

const [world, state] = startMatter(
	[script.Parent.systems, ReplicatedStorage.Shared.systems],
	serverState,
);

export type RootSystem = System<[typeof world, typeof state]>;
