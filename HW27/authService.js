import { ROLES } from "./config.js";

const users = [
  { name: 'John', role: ROLES.USER },
  { name: 'Bill', role: ROLES.ADMIN }
];

export function getAuthenticatedUser(inputName) {
  if (!inputName) {
    return { name: 'Anonimus', role: ROLES.GUEST };
  }

  const cleanName = inputName.trim();
  const foundUser = users.find(u => u.name.toLowerCase() === cleanName.toLowerCase());

  if (foundUser) {
    return foundUser;
  }
  return { name: cleanName, role: ROLES.GUEST };
}