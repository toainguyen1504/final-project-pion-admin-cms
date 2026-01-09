import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import UserTable from "@/components/users/UserTable";
import { useUsers } from "@/hooks";

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

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
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
          <p className="text-slate-500 mt-0.5">
            Xem, quản lý và cập nhật toàn bộ người dùng trong hệ thống.
          </p>
        </div>
        <Button
          onClick={() => navigate("/nguoi-dung/tao-moi")}
          className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
          transition-colors duration-300 min-w-36 cursor-pointer rounded-xl"
        >
          <Plus className="w-4 h-4" />
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
        />
      )}
    </div>
  );
}

export default UserList;
