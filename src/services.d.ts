interface Workspace {
	Camera: Camera;
	Baseplate: Part & {
		Texture: Texture;
	};
	readonly Terrain: Terrain;
	SpawnLocation: SpawnLocation & {
		Decal: Decal;
	};
	Rig: Model & {
		Head: Part & {
			Mesh: SpecialMesh;
			face: Decal;
			HairAttachment: Attachment;
			HatAttachment: Attachment;
			FaceFrontAttachment: Attachment;
			FaceCenterAttachment: Attachment;
		};
		Torso: Part & {
			roblox: Decal;
			NeckAttachment: Attachment;
			BodyFrontAttachment: Attachment;
			BodyBackAttachment: Attachment;
			LeftCollarAttachment: Attachment;
			RightCollarAttachment: Attachment;
			WaistFrontAttachment: Attachment;
			WaistCenterAttachment: Attachment;
			WaistBackAttachment: Attachment;
			"Right Shoulder": Motor6D;
			"Left Shoulder": Motor6D;
			"Right Hip": Motor6D;
			"Left Hip": Motor6D;
			Neck: Motor6D;
		};
		"Left Arm": Part & {
			LeftShoulderAttachment: Attachment;
			LeftGripAttachment: Attachment;
		};
		"Right Arm": Part & {
			RightShoulderAttachment: Attachment;
			RightGripAttachment: Attachment;
		};
		"Left Leg": Part & {
			LeftFootAttachment: Attachment;
		};
		"Right Leg": Part & {
			RightFootAttachment: Attachment;
		};
		Humanoid: Humanoid & {
			Animator: Animator;
			HumanoidDescription: HumanoidDescription;
		};
		HumanoidRootPart: Part & {
			RootAttachment: Attachment;
			RootJoint: Motor6D;
		};
		Animate: LocalScript & {
			idle: StringValue & {
				Animation1: Animation & {
					Weight: NumberValue;
				};
				Animation2: Animation & {
					Weight: NumberValue;
				};
			};
			walk: StringValue & {
				WalkAnim: Animation;
			};
			run: StringValue & {
				RunAnim: Animation;
			};
			jump: StringValue & {
				JumpAnim: Animation;
			};
			climb: StringValue & {
				ClimbAnim: Animation;
			};
			toolnone: StringValue & {
				ToolNoneAnim: Animation;
			};
			fall: StringValue & {
				FallAnim: Animation;
			};
			sit: StringValue & {
				SitAnim: Animation;
			};
			PlayEmote: BindableFunction;
			ScaleDampeningPercent: NumberValue;
		};
		"Body Colors": BodyColors;
	};
}

interface ReplicatedStorage {
	Shared: Folder & {
		components: Folder & {
			cart: ModuleScript;
			grabable: ModuleScript;
			model: ModuleScript;
		};
		constants: Folder & {
			core: ModuleScript;
			"matter-component": ModuleScript;
		};
		matter: Folder & {
			component: ModuleScript;
			hooks: Folder & {
				useStartup: ModuleScript;
			};
			startMatter: ModuleScript;
		};
		remotes: ModuleScript;
		systems: Folder;
	};
	Assets: Folder & {
		Cart: Model & {
			Root: Part;
		};
	};
}
