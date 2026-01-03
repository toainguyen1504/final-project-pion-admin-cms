import { Helmet } from "react-helmet-async";

function UserRole() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Quản Lý Vai Trò Người Dùng | Pion CMS</title>
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        Quản Lý Vai Trò Người Dùng
      </h2>
      <p className="text-slate-500 mt-2">
        . Danh sách vai trò (Role List) có tính năng CRUD role <br />
        . Gán vai trò cho người dùng theo " Giao diện chọn user và gán - thay
        đổi role" (Assign Role) <br />
        . Xem quyền tương ứng của từng role (Role Permissions) (ví dụ: Super
        Admin Quản lý hệ thống, người dùng, vai trò, cấu hình, xóa dữ liệu)
        <br />
      </p>
    </div>
  );
}

export default UserRole;
