-- from https://github.com/osyrisrblx/rbxts-build/blob/master/scripts/sync.lua

local fs = require('@lune/fs')
local roblox = require('@lune/roblox')
local env = require("modules/env-reader").config()
local place = require("modules/place")

local placeId = assert(env.GAME_PLACE_ID, "GAME_PLACE_ID not expecified")
local outPath = env.OUT_PATH or "src/services.d.ts"

local placeContents = place.download(placeId)
local game = roblox.deserializePlace(placeContents)

local SERVICES_TO_GENERATE = {
	"Workspace",
	"ReplicatedStorage",
	"ServerStorage",
	"StarterGui"
}

local INSTANCE_BLACKLIST = {
	"rbxts_include",
	"REFLEX_DEVTOOLS",
	"REFLEX_DEVTOOLS_CLIENT"
}

local output = ""
local indent = ""

local function pushIndent()
	indent = indent .. "\t"
end

local function popIndent()
	indent = string.sub(indent, 2)
end

local function writeLine(str)
	if str == "" then
		output = output .. "\n"
	else
		output = output .. indent .. str .. "\n"
	end
end

local function writeService(service)
	local serviceChildren = service:GetChildren()

	if next(serviceChildren) == nil then
		return
	end

	writeLine("interface " .. service.ClassName .. " {")
	pushIndent()

	local function search(instance)
		local name = instance.Name
		if table.find(INSTANCE_BLACKLIST, name) ~= nil then
			return
		end
		local prefix = ""
		if name == "Terrain" and instance.Parent == game.Workspace then
			prefix = "readonly "
		end
		if not string.match(name, "^[_a-zA-Z][_a-zA-Z0-9]*$") then
			name = '"' .. name .. '"'
		end
		local definition = prefix .. name .. ": " .. instance.ClassName
		local children = instance:GetChildren()
		if next(children) == nil then
			writeLine(definition .. ";")
		else
			writeLine(definition .. " & {")
			pushIndent()
			local seen = {}
			for _, child in ipairs(children) do
				if not seen[child.Name] then
					seen[child.Name] = true
					search(child)
				end
			end
			popIndent()
			writeLine("};")
		end
	end
	for _, child in ipairs(serviceChildren) do
		search(child)
	end

	popIndent()
	writeLine("}")
	writeLine("")
end

for _, service in game:GetChildren() do
	if table.find(SERVICES_TO_GENERATE, service.Name) ~= nil then
		writeService(service)
	end
end

output = string.match(output, "^(.-)%s*$")

fs.writeFile(outPath, output .. "\n")