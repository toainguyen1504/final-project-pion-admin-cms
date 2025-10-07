import { Helmet } from "react-helmet";

function CategoriesList() {
  return (
    <div className="p-4">
      <Helmet>
        <title>All Categories | Pion CMS</title>
        <meta
          name="description"
          content="List Categories for system management"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        All Categories
      </h2>
      <p className="text-slate-500 mt-2">This is the All Categories page</p>
    </div>
  );
}

export default CategoriesList;
