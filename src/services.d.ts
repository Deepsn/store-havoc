interface ReplicatedStorage {
	Shared: Folder & {
		components: Folder & {
			drop: ModuleScript;
			model: ModuleScript;
		};
		constants: Folder & {
			core: ModuleScript;
		};
		matter: Folder & {
			component: ModuleScript;
			start: ModuleScript;
		};
		systems: Folder;
	};
	rbxts_include: Folder & {
		Promise: ModuleScript;
		RuntimeLib: ModuleScript;
	};
	Drops: Folder & {
		Part: Model & {
			Part: Part;
		};
	};
}

interface ServerScriptService {
	TS: Folder & {
		runtime: Script;
		systems: Folder & {
			"spawn-drop": ModuleScript;
		};
	};
}

interface Workspace {
	Baseplate: Part;
	readonly Terrain: Terrain;
}
