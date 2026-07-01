const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const EleventyImage = require("@11ty/eleventy-img");

// Match the same pathPrefix logic used by the `| url` filter so that
// shortcode-generated image URLs are prefixed correctly in preview builds.
const pathPrefix = (process.env.PATH_PREFIX || "/").replace(/\/+$/, "") + "/";
const imgUrlPath = pathPrefix + "assets/images/";

module.exports = function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://nittisnyc.com/", // Replace with your client's URL
    },
  });
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Image optimization shortcode
  // Usage: {% image "/assets/images/foo.jpg", "Alt text", "sizes", [w1,w2], "pictureClass", "imgClass", "eager|lazy" %}
  eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, sizes, widths, pictureClass, imgClass, loading) {
    const inputPath = src.startsWith("/") ? `src${src}` : src;
    loading = loading || "lazy";

    let metadata;
    try {
      metadata = await EleventyImage(inputPath, {
        widths: widths || [400, 800, 1200],
        formats: ["avif", "webp", "auto"],
        outputDir: "./dist/assets/images/",
        urlPath: imgUrlPath,
        cacheOptions: { duration: "1d", directory: ".cache" },
      });
    } catch (e) {
      console.warn(`[image shortcode] Could not process "${src}": ${e.message}`);
      const cls = imgClass ? ` class="${imgClass}"` : "";
      return `<img src="${src}" alt="${alt || ""}"${cls} loading="${loading}">`;
    }

    const imgAttrs = {
      alt: alt || "",
      sizes: sizes || "100vw",
      loading,
      decoding: loading === "eager" ? "sync" : "async",
    };
    if (imgClass) imgAttrs.class = imgClass;

    const picAttrs = {};
    if (pictureClass) picAttrs.class = pictureClass;
    if (!alt) picAttrs["aria-hidden"] = "true";

    return EleventyImage.generateHTML(metadata, imgAttrs, {
      pictureAttributes: picAttrs,
      whitespaceMode: "inline",
    });
  });

  // Background-image URL shortcode (for CSS background-image: url(...), where
  // the <picture>/<img> markup from the "image" shortcode doesn't apply).
  // Usage: {% imageUrl "/assets/images/foo.png", [w1,w2] %}
  eleventyConfig.addNunjucksAsyncShortcode("imageUrl", async function(src, widths) {
    const inputPath = src.startsWith("/") ? `src${src}` : src;

    const metadata = await EleventyImage(inputPath, {
      widths: widths || [null],
      formats: ["webp"],
      outputDir: "./dist/assets/images/",
      urlPath: imgUrlPath,
      cacheOptions: { duration: "1d", directory: ".cache" },
    });

    const entries = metadata.webp;
    return entries[entries.length - 1].url;
  });

  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("dist/css/styles.css");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
