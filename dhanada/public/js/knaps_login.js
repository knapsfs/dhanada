frappe.ready(function() {
  if (document.body && document.body.getAttribute("data-path") === "login") {
    if (!window.jQuery(".knaps-back-link").length) {
      window.jQuery(".page-card").append(
        '<div class="knaps-back-link"><a href="/" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 600; text-decoration: none;"><span>&larr;</span> Back to Website</a></div>'
      );
    }
  }
});
