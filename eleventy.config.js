export default async function(eleventyConfig) {
    eleventyConfig.addWatchTarget("./src/sass");
    eleventyConfig.addGlobalData("permalink", "{{ page.filePathStem }}.html");
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("dist");
}