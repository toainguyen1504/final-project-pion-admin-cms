import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";

function Dashboard() {
  return (
    <div className="space-y-6">
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
