import { Helmet } from "react-helmet-async";

function ConsultationList() {
  return (
    <div className="p-4">
      <Helmet>
        <title>All Consultation | Pion CMS</title>
        <meta
          name="description"
          content="List Consultation for system management"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        All Consultation
      </h2>
      <p className="text-slate-500 mt-2 mb-4">This is the Consultation List page</p>
      <a
        href="https://docs.google.com/spreadsheets/d/1nfmM1_2N-MFV9Ws1snmOXCI29ajYOYx_0kFG2jvHiLY/edit?gid=0#gid=0"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline transition-colors"
      >
        Truy cập (click) để xem danh sách tư vấn trên GG Sheet
      </a>
    </div>
  );
}

export default ConsultationList;
