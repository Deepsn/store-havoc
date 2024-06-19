import { CartComponent } from "@/shared/components/cart";
import { ModelComponent } from "@/shared/components/model";
import type { SharedSystem } from "@/shared/matter/startMatter";
import type { World } from "@rbxts/matter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

const cartContainer = new Instance("Folder");
cartContainer.Name = "CartContainer";
cartContainer.Parent = Workspace;

function cartsOnPlayers(world: World) {
	for (const [id, { model }] of world.query(ModelComponent).without(CartComponent)) {
		const root = model.FindFirstChild("HumanoidRootPart") as BasePart | undefined;

		if (!root) continue;

		const cart = ReplicatedStorage.Assets.Cart.Clone();

		cart.PivotTo(root.CFrame);

		for (const part of cart.GetDescendants()) {
			if (!part.IsA("BasePart")) continue;

			const weld = new Instance("WeldConstraint");
			weld.Part0 = root;
			weld.Part1 = part;
			weld.Name = `${part.Name}_weld`;
			weld.Parent = root;
		}

		cart.Parent = cartContainer;

		world.insert(id, CartComponent({ cart }));
	}
}

export = {
	system: cartsOnPlayers,
} as SharedSystem;
