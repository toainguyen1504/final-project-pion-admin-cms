export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  STAFF: "staff",
  STAFFADS: "staffads",
  TEACHER: "teacher",
  LEARNER: "learner",
  GUEST: "guest",
};

// role được phép CRUD user
export const USER_MANAGEMENT_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN];

// role KHÔNG được gán
export const BLOCKED_ASSIGN_ROLES = [ROLES.SUPER_ADMIN, ROLES.GUEST];

// role được phép thực hiện hành động xóa
export const DELETE_ALLOWED_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN];
