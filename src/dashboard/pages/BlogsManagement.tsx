const BlogsManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-3xl font-bold text-neon-gradient mb-2">
          Blogs Management
        </h1>
        <p className="text-muted-foreground">
          Sync and manage your blog posts
        </p>
      </div>

      <div className="p-12 rounded-lg border border-[hsl(var(--deep-electric-blue)/0.3)] bg-[hsl(var(--void-black)/0.5)] backdrop-blur-sm text-center">
        <span className="text-6xl mb-4 block">📚</span>
        <h2 className="font-orbitron text-xl font-bold text-foreground mb-2">
          Coming Soon
        </h2>
        <p className="text-muted-foreground">
          Blog management interface is under construction
        </p>
      </div>
    </div>
  );
};

export default BlogsManagement;