import { USER_MANAGEMENT_ROLES } from "@/constants/roles";

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function getCurrentRole() {
  const user = getCurrentUser();
  return user?.role?.name || null;
}

export function hasRole(allowedRoles = []) {
  const role = getCurrentRole();
  if (!role) return false;
  return allowedRoles.includes(role);
}

export function isAdminUser() {
  const role = getCurrentRole();
  return USER_MANAGEMENT_ROLES.includes(role);
}
