local roblox = require("@lune/roblox")
local env = require("env-reader").config()

local auth = {}

function auth.getCookie()
    local cookie = roblox.getAuthCookie()
    
    if cookie then
        return cookie
    end

    return `.ROBLOSECURITY={env.ROBLOSECURITY}` 
end 

return auth