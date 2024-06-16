local fs = require("@lune/fs")

local env = {} :: { [string]: string }

local function parse(contents: string)
    local data = {}

    for _, line in contents:split("\n") do
        local lineInfo = line:split("=")
        local key = lineInfo[1]
        local value = lineInfo[2]

        if value then
            data[key] = value:gsub("%s+$", "")
        end
    end

    -- transform data into roblox data types
    for key, value in data do
        if value == "true" then
            data[key] = true
        elseif value == "false" then
            data[key] = false
        elseif tonumber(value) then
            data[key] = tonumber(value)
        end
    end

    return data
end

local function config(path: string?): typeof(env)
    path = path or "./.env"

    local success, contents = pcall(function()
        return fs.readFile(path :: string)
    end)

    if not success then
        error(`Failed to read .env file located at "${path}"\nError: ${contents}`)
    end

    local parseSuccess, error = pcall(function()
        env = parse(contents)
    end)

    if not parseSuccess then
        error(`Failed to parse .env file\nError: ${error}`)
    end

    return env
end

return {
    config = config
}