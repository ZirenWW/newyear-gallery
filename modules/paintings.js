import * as THREE from "three";
import { paintingData } from "./paintingData.js";

function makeWoodTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d");

  // base
  ctx.fillStyle = "#7a4a21";
  ctx.fillRect(0, 0, c.width, c.height);

  // grain
  for (let i = 0; i < 4500; i++) {
    const y = Math.random() * c.height;
    const x = Math.random() * c.width;
    const w = 80 + Math.random() * 220;
    const a = 0.02 + Math.random() * 0.08;
    ctx.strokeStyle = `rgba(30, 15, 5, ${a})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + (Math.random() - 0.5) * 10);
    ctx.stroke();
  }

  // knots
  for (let k = 0; k < 18; k++) {
    const cx = Math.random() * c.width;
    const cy = Math.random() * c.height;
    const r = 10 + Math.random() * 45;
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    g.addColorStop(0, "rgba(25,12,5,0.35)");
    g.addColorStop(1, "rgba(25,12,5,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

// 生成“镂空相框”几何：外矩形 - 内矩形（洞）
function makeFrameMesh(width, height, border, material) {
  const outer = new THREE.Shape();
  outer.moveTo(-width / 2, -height / 2);
  outer.lineTo(width / 2, -height / 2);
  outer.lineTo(width / 2, height / 2);
  outer.lineTo(-width / 2, height / 2);
  outer.lineTo(-width / 2, -height / 2);

  const innerW = width - border * 2;
  const innerH = height - border * 2;

  const hole = new THREE.Path();
  hole.moveTo(-innerW / 2, -innerH / 2);
  hole.lineTo(innerW / 2, -innerH / 2);
  hole.lineTo(innerW / 2, innerH / 2);
  hole.lineTo(-innerW / 2, innerH / 2);
  hole.lineTo(-innerW / 2, -innerH / 2);

  outer.holes.push(hole);

  const geo = new THREE.ShapeGeometry(outer);
  const mesh = new THREE.Mesh(geo, material);
  return mesh;
}

export function createPaintings(scene, textureLoader) {
  const paintings = [];

  // ✅ 画的高度（你现在 7.2 太大了，会很怪；建议 3.2~4.2）
  const TARGET_HEIGHT = 6.8;

  // ✅ 相框边宽（太宽就像木板；建议 0.12~0.22）
  const FRAME_BORDER = 0.18;

  // ✅ 让照片在框前面一点点，避免 z-fighting
  const PHOTO_OFFSET = 0.02;

  const woodTexture = makeWoodTexture();

  const frameMat = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.85,
    metalness: 0.0,
  });

  paintingData.forEach((data) => {
    // 占位照片（等图片加载后按比例改）
    const placeholderGeo = new THREE.PlaneGeometry(2.6, TARGET_HEIGHT);
    const placeholderMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const painting = new THREE.Mesh(placeholderGeo, placeholderMat);

    painting.position.set(data.position.x, data.position.y, data.position.z + PHOTO_OFFSET);
    painting.rotation.y = data.rotationY;

    painting.userData = {
      type: "painting",
      info: data.info,
      url: data.info?.link,
    };

    painting.castShadow = true;
    painting.receiveShadow = true;

    paintings.push(painting);

    // 占位相框（先按占位尺寸做一个）
    let frame = makeFrameMesh(2.6 + FRAME_BORDER * 2, TARGET_HEIGHT + FRAME_BORDER * 2, FRAME_BORDER, frameMat);
    frame.position.set(data.position.x, data.position.y, data.position.z);
    frame.rotation.y = data.rotationY;
    frame.castShadow = true;
    frame.receiveShadow = true;
    scene.add(frame);

    // 图片加载后：按真实比例更新“照片 + 相框”
    textureLoader.load(
      data.imgSrc,
      (texture) => {
        const img = texture.image;
        if (!img || !img.width || !img.height) {
          painting.material.map = texture;
          painting.material.needsUpdate = true;
          return;
        }

        const aspect = img.width / img.height;
        const width = TARGET_HEIGHT * aspect;

        // 更新照片
        painting.geometry.dispose();
        painting.geometry = new THREE.PlaneGeometry(width, TARGET_HEIGHT);

        painting.material.dispose();
        painting.material = new THREE.MeshLambertMaterial({ map: texture });
        painting.material.needsUpdate = true;

        // 更新相框（先删旧的）
        scene.remove(frame);
        frame.geometry.dispose();

        frame = makeFrameMesh(
          width + FRAME_BORDER * 2,
          TARGET_HEIGHT + FRAME_BORDER * 2,
          FRAME_BORDER,
          frameMat
        );
        frame.position.set(data.position.x, data.position.y, data.position.z);
        frame.rotation.y = data.rotationY;
        frame.castShadow = true;
        frame.receiveShadow = true;
        scene.add(frame);
      },
      undefined,
      (err) => console.error("Failed to load painting texture:", data.imgSrc, err)
    );
  });

  return paintings;
}
