import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import UserTable from "@/components/users/UserTable";
import { useUsers } from "@/hooks";
import { getCurrentUser } from "@/utils/auth";

function UserList() {
  const {
    users,
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
    reloadUsers,
  } = useUsers();

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  return (
    <div className="space-y-3 px-4 pt-4 pb-10">
      <Helmet>
        <title>Tất Cả Người Dùng | Pion CMS</title>
        <meta
          name="description"
          content="Danh sách người dùng cho hệ thống quản lý"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Tất Cả Người Dùng
          </h2>
          <p className="mt-0.5 text-slate-500">
            Xem, quản lý và cập nhật toàn bộ người dùng trong hệ thống.
          </p>
        </div>

        <Button
          onClick={() => navigate("/nguoi-dung/tao-moi")}
          className="min-w-36 cursor-pointer rounded-xl bg-indigo-600 text-white transition-colors duration-300 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <Plus className="h-4 w-4" />
          Thêm Người Dùng Mới
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Đang tải người dùng...</span>
        </div>
      ) : (
        <UserTable
          data={users}
          meta={meta}
          page={page}
          setPage={setPage}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          search={search}
          setSearch={setSearch}
          refreshUsers={reloadUsers}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default UserList;
