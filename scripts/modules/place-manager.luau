local roblox = require("@lune/roblox")

local manager = {}

type GamePlace = typeof(roblox.deserializePlace(""))

function manager.mergePlaces(gamePlace: GamePlace, buildingPlace: GamePlace)
    local services_to_merge = {
        "Workspace",
        "ReplicatedStorage",
        "ServerStorage",
        "Lighting",
    }

    local blacklisted_instances = {
        "Camera"
    }

    for _, service_name in services_to_merge do
        local buildingService = buildingPlace:GetService(service_name)
        local gameService = gamePlace:GetService(service_name)

        for _, child in ipairs(buildingService:GetChildren()) do
            if table.find(blacklisted_instances, child.ClassName) then
                continue
            end

            child.Parent = gameService
        end
    end
end

function manager.setup(game: GamePlace)
    local workspace = game:GetService("Workspace")
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    for _, instance in workspace:GetChildren() do
        if not instance:IsA("Folder") or instance:GetAttribute("Ignore") then
            continue
        end

        instance.Parent = ReplicatedStorage
    end
end

return manager