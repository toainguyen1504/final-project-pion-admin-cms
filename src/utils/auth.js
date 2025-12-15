export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isAdminUser() {
  const user = getCurrentUser();
  return user?.email === "admin@pion.vn"; // sau này sẽ phân quyền nâng cao hơn (theo role,...)
}
