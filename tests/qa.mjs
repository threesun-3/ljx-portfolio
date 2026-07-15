import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(process.cwd());
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const relative = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = normalize(join(root, relative));
    if (!filePath.startsWith(root)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mime[extname(filePath).toLowerCase()] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((resolveReady) => server.listen(4173, "127.0.0.1", resolveReady));

const browser = await chromium.launch({ headless: true, executablePath: edgePath });
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function inspect(viewport, label) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });

  const response = await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  check(response?.ok(), `${label}: 首页请求失败`);
  check(runtimeErrors.length === 0, `${label}: 浏览器错误 ${runtimeErrors.join(" | ")}`);

  const geometry = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  check(geometry.document <= geometry.viewport + 1, `${label}: 页面横向溢出 ${JSON.stringify(geometry)}`);
  check(geometry.body <= geometry.viewport + 1, `${label}: body 横向溢出 ${JSON.stringify(geometry)}`);

  const outOfBounds = await page.evaluate(() => {
    const selectors = [".hero-name", ".hero-role", ".hero-summary", ".hero-actions", ".hero-media"];
    return selectors.filter((selector) => {
      const element = document.querySelector(selector);
      if (!element) return true;
      const rect = element.getBoundingClientRect();
      return rect.left < -1 || rect.right > window.innerWidth + 1;
    });
  });
  check(outOfBounds.length === 0, `${label}: 首屏元素超出可视范围 ${outOfBounds.join(", ")}`);

  const fontsReady = await page.evaluate(() =>
    document.fonts.check('400 16px "Space Grotesk"') && document.fonts.check('500 16px "IBM Plex Mono"'),
  );
  check(fontsReady, `${label}: 本地字体没有正确加载`);

  check((await page.locator("#skills-grid .skill-card").count()) === 6, `${label}: 能力卡片数量错误`);
  check((await page.locator("#timeline .timeline-item").count()) === 4, `${label}: 经历数量错误`);
  check((await page.locator("#certificate-grid .certificate-card").count()) === 12, `${label}: 证书数量错误`);

  const brokenImages = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => image.hasAttribute("src") && image.complete && image.naturalWidth === 0)
      .map((image) => image.src),
  );
  check(brokenImages.length === 0, `${label}: 图片加载失败 ${brokenImages.join(", ")}`);

  if (label === "desktop") {
    const resumeHref = await page.locator("#resume-link").getAttribute("href");
    const resumeResponse = await page.request.get(new URL(resumeHref, page.url()).toString());
    check(resumeResponse.ok(), "desktop: PDF 简历下载失败");
    check(
      resumeResponse.headers()["content-type"]?.includes("application/pdf"),
      "desktop: 简历链接返回的不是 PDF",
    );

    const certificateImages = page.locator("#certificate-grid img");
    for (let index = 0; index < (await certificateImages.count()); index += 1) {
      const image = certificateImages.nth(index);
      await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        (position) => {
          const target = document.querySelectorAll("#certificate-grid img")[position];
          return target?.complete && target.naturalWidth > 0;
        },
        index,
      );
    }
    const decodedImages = await certificateImages.evaluateAll((images) =>
      images.filter((image) => image.complete && image.naturalWidth > 0).length,
    );
    check(decodedImages === 12, `desktop: 证书图片解码数量错误，实际 ${decodedImages}`);

    await page.locator('[data-category="国家级竞赛"]').click();
    check((await page.locator("#certificate-grid .certificate-card").count()) === 5, "desktop: 分类筛选结果错误");

    await page.locator("#certificate-search").fill("工程实践");
    check((await page.locator("#certificate-grid .certificate-card").count()) === 1, "desktop: 搜索结果错误");

    await page.locator("#certificate-grid .certificate-card").first().click();
    check(await page.locator("#certificate-modal").evaluate((dialog) => dialog.open), "desktop: 证书弹窗没有打开");
    check((await page.locator("#modal-title").textContent())?.includes("工程实践"), "desktop: 弹窗内容与证书不匹配");
    await page.locator(".modal-close").click();
    check(!(await page.locator("#certificate-modal").evaluate((dialog) => dialog.open)), "desktop: 证书弹窗没有关闭");

    await page.locator('#site-nav a[href="#certificates"]').click();
    await page.waitForTimeout(100);
    const certTop = await page.locator("#certificates").evaluate((element) => Math.abs(element.getBoundingClientRect().top));
    check(certTop < 100, `desktop: 证书导航没有正确定位，top=${certTop}`);
    check(
      await page.locator('#site-nav a[href="#certificates"]').evaluate((link) => link.classList.contains("is-active")),
      "desktop: 当前导航状态没有更新",
    );
  } else {
    await page.locator(".nav-toggle").click();
    check(await page.locator("#site-nav").evaluate((nav) => nav.classList.contains("is-open")), "mobile: 菜单没有打开");
    await page.locator('#site-nav a[href="#about"]').click();
    check(!(await page.locator("#site-nav").evaluate((nav) => nav.classList.contains("is-open"))), "mobile: 点击导航后菜单没有关闭");
  }

  await page.locator("#copy-email").click();
  await page.waitForFunction(() => document.querySelector("#toast")?.classList.contains("is-visible"));
  check(await page.locator("#toast").evaluate((toast) => toast.classList.contains("is-visible")), `${label}: 复制邮箱没有反馈`);

  await context.close();
}

try {
  await inspect({ width: 1440, height: 1000 }, "desktop");
  await inspect({ width: 390, height: 844 }, "mobile");
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error("QA FAILED");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("QA PASSED: desktop and mobile interactions are healthy.");
