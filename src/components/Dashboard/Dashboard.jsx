import { Helmet } from "react-helmet";
import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";

function Dashboard() {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard | Pion CMS</title>
        <meta
          name="description"
          content="Overview dashboard for system management"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Chart Section */}
      <ChartSection />

      {/* Table section */}
      <div className="w-full">
        <TableSection />
      </div>
    </div>
  );
}

export default Dashboard;
