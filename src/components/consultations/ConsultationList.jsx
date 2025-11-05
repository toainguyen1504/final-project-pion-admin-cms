import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import ConsultationTable from "@/components/consultations/ConsultationTable";
import { exportConsultations, getConsultations } from "@/lib/api/consultation";

function ConsultationList() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const response = await getConsultations(); // đã trả ra data

        setConsultations(response || []);
      } catch (error) {
        console.error("Error loading consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  // handle export excel
  const handleExport = async () => {
    try {
      setExportLoading(true);
      await exportConsultations(consultations);
    } catch (error) {
      console.error("Error exporting consultations:", error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>All Consultations | Pion CMS</title>
        <meta
          name="description"
          content="List of consultations for system management"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            All Consultations
          </h2>
          <p className="text-slate-500 mt-0.5">
            View, manage, and handle consultation requests from users.
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={handleExport}
          disabled={exportLoading}
          className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
          transition-colors duration-300 min-w-36 cursor-pointer rounded-xl flex items-center justify-center gap-2"
        >
          {exportLoading ? (
            <>
              <Spinner className="size-4 text-white" />
              <span>Đang xuất...</span>
            </>
          ) : (
            <span>Xuất file Excel</span>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Loading consultations...</span>
        </div>
      ) : (
        <ConsultationTable data={consultations} />
      )}
    </div>
  );
}

export default ConsultationList;
