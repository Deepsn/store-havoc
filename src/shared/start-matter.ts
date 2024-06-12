import { Debugger, Loop, type System, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { type Context, HotReloader } from "@rbxts/rewire";
import { RunService, UserInputService } from "@rbxts/services";
import { IS_CLIENT } from "./constants/core";

export function startMatter<S extends object>(
	containers: Instance[],
	state: S,
) {
	type T = [World, S, Plasma.Widgets];

	const world = new World();
	const myDebugger = new Debugger<T>(Plasma);
	const loop = new Loop(world, state, myDebugger.getWidgets());

	myDebugger.enabled = false;

	const hotReloader = new HotReloader();

	let firstRunSystems: System<T>[] | undefined = new Array<System<T>>();
	const systemsByModule = new Map<ModuleScript, System<T>>();

	function loadModule(mod: ModuleScript, ctx: Context): void {
		const originalModule = ctx.originalModule;

		const [ok, system] = pcall(require, mod) as LuaTuple<[boolean, System<T>]>;

		if (!ok) {
			warn(`Error when hot-reloading ${mod.Name} system ${system}`);
			return;
		}

		if (firstRunSystems) {
			firstRunSystems.push(system);
		} else if (systemsByModule.has(originalModule)) {
			loop.replaceSystem(systemsByModule.get(originalModule)!, system);
			myDebugger.replaceSystem(systemsByModule.get(originalModule)!, system);
		} else {
			loop.scheduleSystem(system);
		}

		systemsByModule.set(originalModule, system);
	}

	function unloadModule(_: ModuleScript, ctx: Context): void {
		if (ctx.isReloading) return;

		const originalModule = ctx.originalModule;
		if (systemsByModule.has(originalModule)) {
			loop.evictSystem(systemsByModule.get(originalModule)!);
			systemsByModule.delete(originalModule);
		}
	}

	for (const container of containers) {
		hotReloader.scan(container, loadModule, unloadModule);
	}

	loop.scheduleSystems(firstRunSystems);
	firstRunSystems = undefined;

	myDebugger.autoInitialize(loop);

	loop.begin({
		default: RunService.Heartbeat,
	});

	if (IS_CLIENT) {
		UserInputService.InputBegan.Connect((input, process) => {
			if (process) return;

			if (input.KeyCode === Enum.KeyCode.F4) {
				myDebugger.toggle();
			}
		});
	}

	return [world, state];
}
