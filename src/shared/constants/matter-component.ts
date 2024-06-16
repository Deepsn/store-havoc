import { RunService } from "@rbxts/services";

export const attributeName = RunService.IsClient() ? "ClientEntityId" : "ServerEntityId";
