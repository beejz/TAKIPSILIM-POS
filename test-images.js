// Test if images can be loaded
const images = {
  "image-1763813745.jpeg": require("./assets/image-1763813745.jpeg"),
  "image-1763813741.jpeg": require("./assets/image-1763813741.jpeg"),
  "image-1763813738.jpeg": require("./assets/image-1763813738.jpeg"),
  "image-1763813733.jpeg": require("./assets/image-1763813733.jpeg"),
  "image-1763813726.jpeg": require("./assets/image-1763813726.jpeg"),
  "image-1763813721.jpeg": require("./assets/image-1763813721.jpeg"),
  "image-1763813723.jpeg": require("./assets/image-1763813723.jpeg"),
  "image-1763022491.jpeg": require("./assets/image-1763022491.jpeg"),
  "image-1763022486.jpeg": require("./assets/image-1763022486.jpeg"),
  "image-1763022493.jpeg": require("./assets/image-1763022493.jpeg"),
  "image-1763022495.jpeg": require("./assets/image-1763022495.jpeg"),
};

console.log("Images loaded:", Object.keys(images).length);
Object.entries(images).forEach(([name, img]) => {
  console.log(name, "=>", typeof img, img);
});
