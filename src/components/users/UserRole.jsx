import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import RoleTable from "@/components/users/RoleTable";
import { useRoles } from "@/hooks";

// 1. UI: Cần tạo modal để thêm mới vai trò người dùng
// 2. UI: Cần tạo modal để chỉnh sửa vai trò người dùng (tương tự tạo vai trò modal)
// 3. UI: Cần tạo giao diện để gán vai trò cho người dùng (trong table role list có nút gán role)
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

  const [createModalOpen, setCreateModalOpen] = useState(false);
  // const [editModalOpen, setEditModalOpen] = useState(false);
  // const [selectedRole, setSelectedRole] = useState(null); // dùng cho edit
  // const navigate = useNavigate();

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
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)} // mở modal tạo role mới
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

      {/* Modal tạo role */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm Vai Trò Mới</DialogTitle>
            <DialogDescription>
              Tạo vai trò mới để phân quyền người dùng trong hệ thống.
            </DialogDescription>
          </DialogHeader>

          <CreateRoleForm onClose={() => setCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateRoleForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // mock validation thay cho gọi API
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = ["Tên role là bắt buộc."];
    } else if (formData.name.length < 3) {
      newErrors.name = ["Tên role phải có ít nhất 3 ký tự."];
    }

    if (!formData.display_name.trim()) {
      newErrors.display_name = ["Tên hiển thị là bắt buộc."];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Vui lòng kiểm tra lại biểu mẫu!");
      setLoading(false);
      return;
    }

    // Nếu không có lỗi thì giả lập thành công
    console.log("Mock submit role:", formData);
    toast.success("Thêm vai trò thành công (mock)!");
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tên Role */}
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
        >
          Tên Role
          <span className="text-red-500 text-sm">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Vd: super_admin"
          className="py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
        />
        {errors.name && (
          <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      {/* Tên hiển thị */}
      <div className="space-y-2">
        <Label
          htmlFor="display_name"
          className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
        >
          Tên hiển thị
          <span className="text-red-500 text-sm">*</span>
        </Label>
        <Input
          id="display_name"
          name="display_name"
          value={formData.display_name}
          onChange={handleChange}
          placeholder="Vd: Super Administrator"
          className="py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
        />
        {errors.display_name && (
          <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
            {errors.display_name[0]}
          </p>
        )}
      </div>

      {/* Mô tả */}
      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
        >
          Mô tả (Role Permissions)
        </Label>

        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Quyền cao nhất, quản lý toàn bộ hệ thống"
          className="py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
        />
        {errors.description && (
          <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
            transition-colors duration-300 rounded-xl"
        >
          {loading && <Spinner className="w-4 h-4 mr-2 text-white" />}
          Lưu Vai Trò
        </Button>
      </div>
    </form>
  );
}

export default UserRole;
