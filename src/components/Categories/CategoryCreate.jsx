import { Helmet } from "react-helmet";

function CategoryCreate() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Create Category| Pion CMS</title>
        <meta
          name="description"
          content="Create Categories for system management"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        Post Categories
      </h2>
      <p className="text-slate-500 mt-2">This is the Post Categories page.</p>
    </div>
  );
}

export default CategoryCreate;
