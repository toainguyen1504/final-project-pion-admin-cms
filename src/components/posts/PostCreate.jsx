import { Helmet } from "react-helmet-async";

function PostCreate() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Create Post| Pion CMS</title>
        <meta
          name="description"
          content="Create Post for system management"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
        Add Post
      </h2>
      <p className="text-slate-500 mt-2">This is the Add Post page.</p>
    </div>
  );
}

export default PostCreate;
