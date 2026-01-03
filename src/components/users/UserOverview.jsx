import { Helmet } from "react-helmet-async";

function UserOverview() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Thống Kê Người Dùng | Pion CMS</title>
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        Thống Kê Người Dùng
      </h2>
      <p className="text-slate-500 mt-2">
        Tổng số người dùng theo role <br />
        Số lượng người dùng mới theo tuần/tháng <br />
        Tỷ lệ hoạt động (active/inactive) <br />
      </p>
    </div>
  );
}

export default UserOverview;
