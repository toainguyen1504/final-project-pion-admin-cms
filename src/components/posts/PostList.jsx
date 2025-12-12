import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import PostTable from "@/components/posts/PostTable";
import { usePosts } from "@/hooks";

function PostList() {
  const {
    posts,
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
    reloadPosts,
  } = usePosts();

  const navigate = useNavigate();

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Tất Cả Bài Viết | Pion CMS</title>
        <meta name="description" content="Danh sách bài viết cho hệ thống quản lý" />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Tất Cả Bài Viết
          </h2>
          <p className="text-slate-500 mt-0.5">
            Xem, quản lý và cập nhật toàn bộ bài viết được đăng trong hệ thống.
          </p>
        </div>

        <Button
          onClick={() => navigate("/bai-viet/tao-moi")}
          className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
          transition-colors duration-300 min-w-36 cursor-pointer rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Thêm Bài Viết Mới
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Đang tải bài viết...</span>
        </div>
      ) : (
        <PostTable
          data={posts}
          meta={meta}
          page={page}
          setPage={setPage}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          search={search}
          setSearch={setSearch}
          refreshPosts={reloadPosts}
        />
      )}
    </div>
  );
}

export default PostList;
