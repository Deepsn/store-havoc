import { useHookState } from "@rbxts/matter";

export function useStartup(discriminator?: unknown) {
	const storage = useHookState<{ started: boolean }>(discriminator);

	if (!storage.started) {
		storage.started = true;
		return true;
	}

	return false;
}
