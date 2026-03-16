import { Helmet } from "react-helmet-async";

function UserEdit() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Chỉnh Sửa Người Dùng| Pion CMS</title>
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        Chỉnh Sửa Người Dùng
      </h2>
      <p className="text-slate-500 mt-2">Trang chỉnh sửa User</p>
    </div>
  );
}

export default UserEdit;
