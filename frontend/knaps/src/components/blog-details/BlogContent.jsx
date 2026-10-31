export default function BlogContent({ blog }) {
  if (!blog?.content) {
    return null;
  }

  return (
    <article className="bg-white pb-16 pt-6">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Exact HTML Content from Frappe Desk Text Editor */}
        <div
          className="dynamic-blog-html text-gray-800 text-[18px] leading-[1.9]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </article>
  );
}
