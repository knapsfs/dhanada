export default function BlogContent({ blog }) {
  if (!blog?.content) {
    return null;
  }

  // Render ONLY the exact content received from Frappe backend without adding any extra text or blocks
  return (
    <article className="bg-white pb-20 pt-4">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div
          className="dynamic-blog-html text-gray-700 text-[17px] leading-[1.85]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </article>
  );
}
