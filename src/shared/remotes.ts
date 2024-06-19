import type { AnyComponent } from "@rbxts/matter";
import { type Client, type Server, createRemotes, namespace, remote } from "@rbxts/remo";

export const remotes = createRemotes({
	matter: namespace({
		replicate: remote<Client, [payload: Map<string, Map<string, { data: AnyComponent | undefined }>>]>(),
		start: remote<Server>(),
	}),
});
