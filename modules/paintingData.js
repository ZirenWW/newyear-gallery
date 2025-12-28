export const paintingData = [
  // Front Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `artworks/${i + 1}.jpg`,
    width: 5,
    height: 3,
    position: { x: -15 + 10 * i, y: 2, z: -19.5 },
    rotationY: 0,
    info: {
      title: `照片 ${i + 1}`,
      artist: "Family",
      description:
        "我发现我写这个描述的时候。完全不知道我形容的是哪个照片。哈哈哈哈但肯定是很好的回忆",
      year: `2021-2025的某一年`,
      link: "https://github.com/theringsofsaturn",
    },
  })),

  // Back Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `artworks/${i + 5}.jpg`,
    width: 5,
    height: 3,
    position: { x: -15 + 10 * i, y: 2, z: 19.5 },
    rotationY: Math.PI,
    info: {
      title: `照片 ${i + 5}`,
      artist: "Family",
      description:
        "好！",
      year: `2021-2025的某一年`,
      link: "https://github.com/theringsofsaturn",
    },
  })),

  // Left Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `artworks/${i + 9}.jpg`,
    width: 5,
    height: 3,
    position: { x: -19.5, y: 2, z: -15 + 10 * i },
    rotationY: Math.PI / 2,
    info: {
      title: `照片 ${i + 9}`,
      artist: "Family",
      description:
        "好！",
      year: `2021-2025的某一年`,
      link: "https://github.com/theringsofsaturn",
    },
  })),

  // Right Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `artworks/${i + 13}.jpg`,
    width: 5,
    height: 3,
    position: { x: 19.5, y: 2, z: -15 + 10 * i },
    rotationY: -Math.PI / 2,
    info: {
      title: `照片 ${i + 13}`,
      artist: "Family",
      description:
        "好！",
      year: `2021-2025的某一年`,
      link: "https://github.com/theringsofsaturn",
    },
  })),
];
