import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { usePrograms } from "@/hooks/usePrograms";
import ProgramTable from "./ProgramTable";
import ProgramFormModal from "./ProgramFormModal";

function ProgramListPage() {
  const {
    programs,
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
    reloadPrograms,
  } = usePrograms();

  const [openModal, setOpenModal] = useState(false);

  // for edit modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Tất Cả Chương Trình Học | Pion CMS</title>
        <meta
          name="description"
          content="Danh sách chương trình học trong hệ thống quản lý"
        />
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Tất Cả Chương Trình Học
          </h2>
          <p className="text-slate-500 mt-0.5">
            Xem, quản lý và cập nhật toàn bộ chương trình học trong hệ thống.
          </p>
        </div>
        <Button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Thêm Chương Trình Mới
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Đang tải chương trình học...</span>
        </div>
      ) : (
        <ProgramTable
          data={programs}
          meta={meta}
          page={page}
          setPage={setPage}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          search={search}
          setSearch={setSearch}
          refreshPrograms={reloadPrograms}
          onEditProgram={(program) => {
            setSelectedProgram(program);
            setOpenEditModal(true);
          }}
        />
      )}

      {/* Modal tạo mới */}
      <ProgramFormModal
        open={openModal}
        onOpenChange={setOpenModal}
        onSuccess={reloadPrograms}
      />

      {/* Modal chỉnh sửa */}
      <ProgramFormModal
        open={openEditModal}
        onOpenChange={setOpenEditModal}
        initialData={selectedProgram}
        onSuccess={reloadPrograms}
      />
    </div>
  );
}

export default ProgramListPage;
