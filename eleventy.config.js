export default async function(eleventyConfig) {
    eleventyConfig.addWatchTarget("./src/scss");
    eleventyConfig.addPassthroughCopy("./src/assets/");
    eleventyConfig.addPassthroughCopy({"./src/scripts": "assets/js"});
    eleventyConfig.addGlobalData("permalink", "{{ page.filePathStem }}.html");
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("dist");
}