import * as THREE from "three";

function makeStarTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d");

  // 深蓝黑底
  const g = ctx.createRadialGradient(512, 512, 0, 512, 512, 700);
  g.addColorStop(0, "#050714");
  g.addColorStop(1, "#000005");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);

  // 星星
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() < 0.92 ? 1 : 2;
    const a = 0.25 + Math.random() * 0.75;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 少量微彩星
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 1 + Math.random() * 1.5;
    const color = ["#b7d7ff", "#ffe3b7", "#d6b7ff"][Math.floor(Math.random() * 3)];
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.2, 1.4); // 墙面星密度
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createWalls(scene) {
  // ✅ 防止重复叠加：先删旧墙
  const old = scene.getObjectByName("WALL_GROUP");
  if (old) scene.remove(old);

  const wallGroup = new THREE.Group();
  wallGroup.name = "WALL_GROUP";
  scene.add(wallGroup);

  // ✅ 和你项目一致：地板 y = -3.99；天花板 y = 10
  const FLOOR_Y = -3.99;
  const CEILING_Y = 10;

  const H = CEILING_Y - FLOOR_Y;         // 墙高度：刚好贴合地面到天花
  const CENTER_Y = (CEILING_Y + FLOOR_Y) / 2;

  const starTex = makeStarTexture();

  const wallMaterial = new THREE.MeshStandardMaterial({
    map: starTex,
    roughness: 1.0,
    metalness: 0.0,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: starTex,
    emissiveIntensity: 0.16, // 墙别太亮，避免抢画
    side: THREE.DoubleSide,
  });

  const makeWall = (w, h) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMaterial);
    m.receiveShadow = true;
    return m;
  };

  const W = 40;  // 你房间 x/z 是 ±20，所以宽度 40

  const frontWall = makeWall(W, H);
  frontWall.position.set(0, CENTER_Y, -20);

  const backWall = makeWall(W, H);
  backWall.position.set(0, CENTER_Y, 20);
  backWall.rotation.y = Math.PI;

  const leftWall = makeWall(W, H);
  leftWall.position.set(-20, CENTER_Y, 0);
  leftWall.rotation.y = Math.PI / 2;

  const rightWall = makeWall(W, H);
  rightWall.position.set(20, CENTER_Y, 0);
  rightWall.rotation.y = -Math.PI / 2;

  wallGroup.add(frontWall, backWall, leftWall, rightWall);
  return wallGroup;
}
