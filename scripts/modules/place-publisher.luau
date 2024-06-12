local fs = require('@lune/fs')
local net = require('@lune/net')
local serde = require('@lune/serde')

local BASE_URL = "https://apis.roblox.com/universes"

local publisher = {}

function publisher.publish(path: string, apiKey: string, universeId: number, placeId: number, versionType: "Saved" | "Published" | nil)
    versionType = versionType or "Saved"

    local success, placeFile = pcall(fs.readFile, path)

    if not success then
        error("Failed to read place file")
    end

    local url = ("%s/v1/%d/places/%d/versions?versionType=%s"):format(BASE_URL, universeId, placeId, tostring(versionType))

    local responseSuccess, response = pcall(function()
        return net.request({
            url = url,
            method = "POST",
            headers = {
                ["Content-Type"] = "application/octet-stream",
                ["x-api-key"] = apiKey
            },
            body = placeFile
        })
    end)

    if not responseSuccess then
        error(`Something went wrong while sending the request: {response}`)
    end

    local decodeSuccess, responseJson = pcall(function() 
        if not response.ok and not response.body then
            return
        end

        return serde.decode("json", response.body)
    end)

    if not decodeSuccess or responseJson and not responseJson.versionNumber then
        local errorMessage = if decodeSuccess then responseJson.message else "Unknown error"

        if decodeSuccess and responseJson.code == "Conflict" then
            errorMessage = "Publishing failed, maybe someone is on the place"
        end

        if errorMessage == "Unknown error" then
            print("request response:", response)
        end

        error(`Failed to publish place: {errorMessage}`)
    end

    return responseJson.versionNumber :: number
end

return publisher