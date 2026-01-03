import { Helmet } from 'react-helmet-async';

function UserList() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Tất Cả Người Dùng | Pion CMS</title>
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        Tất Cả Người Dùng
      </h2>
      <p className="text-slate-500 mt-2">Danh sách tất cả người dùng</p>
    </div>
  );
}

export default UserList;
