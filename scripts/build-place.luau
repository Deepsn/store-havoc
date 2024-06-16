local process = require("@lune/process")
local roblox = require("@lune/roblox")
local env = require("modules/env-reader").config()
local manager = require('modules/place-manager')
local place = require('modules/place')
local placePublisher = require('modules/place-publisher')

local PLACE_NAME = "game.rbxl"
local BUILD_PLACE_ID = env.BUILD_PLACE_ID
local TEST_PLACE_ID = env.TEST_PLACE_ID
local TEST_UNIVERSE_ID = env.TEST_UNIVERSE_ID
local TEST_PLACE_API_KEY = env.TEST_PLACE_API_KEY

local t0 = os.clock()

-- Compile local typescript files
print("🕒 Compiling typescript files")

local compileT0 = os.clock()
local compileResult = process.spawn("bun", {"run", "compile"})
local compileT1 = os.clock()

if compileResult.ok then
    print("🛠️ Compiled typescript files")
else
    error("❌ Failed to compile typescript files")
end

-- Build temporary game place
print("🕒 Building game place")

local buildResult = process.spawn("bun", {"run", "build"})

if buildResult.ok then
    print("🛠️ Built game place")
else
    error("❌ Failed to build game place")
end

-- Download the building place file
print("🕒 Downloading building place")

local buildPlaceContents = place.download(BUILD_PLACE_ID)
local buildingGame = roblox.deserializePlace(buildPlaceContents)

print("⌛ Downloaded building place")

-- Merge the building place into the game place
print("🕒 Merging building place into game place")

local scriptsPlaceContents = place.getFromFile(PLACE_NAME)
local scriptsGame = roblox.deserializePlace(scriptsPlaceContents)

manager.mergePlaces(scriptsGame, buildingGame)
manager.setup(scriptsGame)

print("✅ Merged building place into game place")

-- Save the game place
print("🕒 Saving game place")

place.save(scriptsGame, PLACE_NAME)

print("💾 Saved game place")

if not env.CANCEL_TESTING_PUBLISH then
    -- Publish testing place
    print("🕒 Publishing testing place")

    local versionNumber = placePublisher.publish(PLACE_NAME, TEST_PLACE_API_KEY, TEST_UNIVERSE_ID, TEST_PLACE_ID)

    print("✅ Published testing place with version number " .. versionNumber)
end

print("🕒 Done in " .. os.clock() - t0 .. "s")
print("🕒 Compile time: " .. compileT1 - compileT0 .. "s")