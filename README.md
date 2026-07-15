# 个人经历与证书展示网站

这是一个适合放到简历中或发送给用人单位查看的静态个人网站。视觉参考 Mimo 官网的深靛蓝、紫色强调、等宽标题和产品卡片语言，但没有复制其品牌、商业字体或图片素材。

## 本地预览

可以直接双击 `index.html`，或在当前目录运行：

```powershell
npx serve .
```

再打开命令行显示的本地网址。

网页发布后不依赖 Node.js。项目中的 Node.js 依赖仅用于浏览器自动测试。

## 自动检查

第一次运行先安装测试依赖：

```powershell
npm install
```

之后运行：

```powershell
npm test
```

测试会使用本机 Microsoft Edge 检查桌面端和手机端，包括横向溢出、导航、筛选、搜索、图片、证书弹窗、移动菜单和复制邮箱反馈。

## 替换成你的真实资料

1. 打开 `data.js`，修改 `profile`、`skills`、`experiences` 和 `certificates`。
2. 把证书图片放入 `assets/certificates/`。
3. 将每张证书的 `image` 改为实际路径，例如：

```js
image: "assets/certificates/英语四级.jpg",
```

4. 把 PDF 简历放到 `assets/resume.pdf`，再把 `profile.resume` 改为：

```js
resume: "assets/resume.pdf",
```

5. 将 `profile.email` 改为真实邮箱，并替换所有标有“示例内容”的文字。

当前项目已经从 `D:\个人资料` 导入了筛选后的照片与代表证书。以后原始素材有更新时，可以运行：

```powershell
python scripts/import_assets.py
```

脚本会重新生成压缩后的 WebP 图片，并把最新版简历复制到 `assets/resume.pdf`。原始个人资料不会被移动或删除。

## 发布前检查

- 遮盖证书图片上的身份证号、准考证号、家庭住址等敏感信息。
- 确认证书名称、获奖级别、颁发机构和日期准确无误。
- 压缩过大的图片，建议单张不超过 1 MB。
- 手机和电脑各检查一次页面效果。
- 不要公开上传含手机号的 PDF，除非你确认愿意公开。

## 免费发布到 GitHub Pages

把代码推送到 GitHub 仓库后，在仓库的 `Settings → Pages` 中选择：

- Source：`Deploy from a branch`
- Branch：`main` / `(root)`

保存后会生成一个可放进简历的公开网址。
