import { ReplicatedStorage } from "@rbxts/services";
import { startMatter } from "../shared/start-matter";

type ClientState = object;
declare const script: { systems: Folder };

const clientState: ClientState = {};

const [world] = startMatter(
	[script.systems, ReplicatedStorage.TS.systems],
	clientState,
);
