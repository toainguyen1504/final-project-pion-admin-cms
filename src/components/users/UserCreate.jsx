import { Helmet } from "react-helmet-async";

function UserCreate() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Tạo Mới Người Dùng | Pion CMS</title>
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        Tạo Mới Người Dùng
      </h2>
      <p className="text-slate-500 mt-2">Trang tạo mới người dùng.</p>
    </div>
  );
}

export default UserCreate;
