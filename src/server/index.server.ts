import { ReplicatedStorage } from "@rbxts/services";
import { startMatter } from "../shared/start-matter";

type ServerState = object;
declare const script: { systems: Folder };

const serverState: ServerState = {};

const [world] = startMatter(
	[script.systems, ReplicatedStorage.TS.systems],
	serverState,
);
