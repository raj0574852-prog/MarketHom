async function run() {
  const r = await fetch('http://localhost:3000/websites/channillo.com');
  const t = await r.text();
  console.log(t.match(/<meta[^>]*name="robots"[^>]*>/i)?.[0]);
  console.log(t.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0]);
}
run();
