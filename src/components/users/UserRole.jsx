import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import RoleTable from "@/components/users/RoleTable";
import { useRoles } from "@/hooks";

// 1. UI: Cần tạo modal để thêm mới vai trò người dùng
// 2. UI: Cần tạo modal để chỉnh sửa vai trò người dùng (tương tự tạo vai trò modal)
// 3. UI: Cần tạo giao diện để gán vai trò cho người dùng
// 4. Logic: Kết nối API từ Backend để lấy danh sách vai trò, tạo mới, chỉnh sửa, xóa vai trò (làm sau khi backend sẵn sàng)

function UserRole() {
  const {
    roles,
    meta,
    loading,
    page,
    setPage,
    sort,
    order,
    setSort,
    setOrder,
    search,
    setSearch,
    reloadRoles,
  } = useRoles();

  const navigate = useNavigate();

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Quản Lý Vai Trò Người Dùng | Pion CMS</title>
        <meta
          name="description"
          content="Danh sách vai trò người dùng, quản lý CRUD, gán role và xem permissions"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Quản Lý Vai Trò Người Dùng
          </h2>
          <p className="text-slate-500 mt-0.5">
            Xem, quản lý, thêm mới và cập nhật vai trò trong hệ thống. Có thể
            gán vai trò cho người dùng và xem quyền tương ứng.
          </p>
          <p className="text-slate-500 mt-2">
            . Danh sách vai trò (Role List = Table) + có tính năng CRUD role
            (theo modal) <br />
            . Gán vai trò cho người dùng theo " Giao diện chọn user và gán -
            thay đổi role" (Assign Role) <br />
            . Xem quyền tương ứng của từng role (Role Permissions) (ví dụ: Super
            Admin Quản lý hệ thống, người dùng, vai trò, cấu hình, xóa dữ liệu)
            <br />
          </p>
        </div>
        <Button
          onClick={() => navigate("/roles/create")} // mở modal tạo role mới
          className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
          transition-colors duration-300 min-w-36 cursor-pointer rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Thêm Vai Trò Mới
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Đang tải vai trò...</span>
        </div>
      ) : (
        <RoleTable
          data={roles}
          meta={meta}
          page={page}
          setPage={setPage}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          search={search}
          setSearch={setSearch}
          refreshRoles={reloadRoles}
        />
      )}
    </div>
  );
}

export default UserRole;
