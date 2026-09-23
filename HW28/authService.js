import { ROLES } from "./config.js";

export function getUserByName(users, userName) {
    const clearName = userName.trim().toLowerCase();
    const user = users.find(u => u.name.toLowerCase() === clearName);
    return user || { name: userName.trim(), role: ROLES.GUEST };
}
