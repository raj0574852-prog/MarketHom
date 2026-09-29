async function run() {
  console.log("=== ROBOTS.TXT ===");
  const r1 = await fetch('https://www.educationhom.com/robots.txt');
  console.log(await r1.text());

  console.log("=== CHANNILLO META ===");
  try {
    const r2 = await fetch('https://www.educationhom.com/websites/channillo.com');
    const t = await r2.text();
    console.log(t.match(/<meta[^>]*name="robots"[^>]*>/i)?.[0]);
    console.log(t.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0]);
  } catch (e) {
    console.error(e);
  }
}
run();
