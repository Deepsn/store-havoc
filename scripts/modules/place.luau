local auth = require('auth')
local fs = require('@lune/fs')
local net = require('@lune/net')
local roblox = require('@lune/roblox')
local serde = require('@lune/serde')

local place = {}

function place.download(placeId: string)
    local cookie = auth.getCookie()

    if not cookie then
        error("Account Cookie not found, please login first")
    end

    local response = net.request({
        url = `https://assetdelivery.roblox.com/v1/assetId/{placeId}`,
        headers = {
            Accept = "application/json",
            Cookie = cookie
        }
    })

    if not response.ok then
        error("Failed to download place file")
    end

    local assetJson = serde.decode("json", response.body)
    local location = assetJson and assetJson.location

    if not location then
        error("Failed to parse place file location")
    end

    local placeResponse = net.request({
        url = location,
        headers = {
            Cookie = cookie
        }
    })

    if not placeResponse.ok then
        error("Failed to download place file")
    end

    return placeResponse.body
end

function place.getFromFile(path: string)
    local success, contents = pcall(fs.readFile, path)

    if not success then
        error("Failed to read place file")
    end

    return contents
end

function place.save(gamePlace: typeof(roblox.deserializePlace("")), path: string)
    local success, contents = pcall(roblox.serializePlace, gamePlace)

    if not success then
        error("Failed to serialize place file")
    end

    local writeSuccess, err = pcall(fs.writeFile, path, contents)

    if not writeSuccess then
        error("Failed to write place file: " .. err)
    end
end

return place