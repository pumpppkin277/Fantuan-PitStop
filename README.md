# 饭团 PitStop

饭团 PitStop 是一个“情绪维修站”微信小程序。用户每天可以打开百宝箱三次，收到 Ollie、Miles、Ace、Lunch、April、Fifteen 和 Padel 留下的一张治愈卡片。

## 功能

- 首次访问角色导览
- 不限次数的随机卡片补给（全部看完后自动开启新一轮）
- 当日卡片不重复
- 微信云开发数据库与云存储

## 本地运行

1. 在微信开发者工具中导入仓库根目录。
2. 在项目设置中填入你自己的小程序 AppID；开发者工具会把它保存到不入库的 `project.private.config.json`。
3. 确认 `miniprogram/config/env.js` 中的云环境 ID。
4. 在云开发数据库中创建 `fantuan_treasures` 集合，导入 `data/treasures.jsonl`。
5. 将卡片和角色图片上传到云存储，并保持数据中的 `image_url` 可访问。

> 云环境 ID 不是密钥。数据库和存储的读写权限必须在微信云开发控制台中正确配置。

## 项目结构

```text
miniprogram/     小程序运行代码
data/            可导入云数据库的卡片数据
assets/          本地原始素材的目录说明（原图不进公开仓库）
tools/           数据维护工具
```

## 内容更新

每条卡片数据为一行 JSON，包含 `text`、`image_url`、`category` 和唯一的 `id_code`。新内容合并前运行：

```sh
python3 tools/validate_treasures.py data/treasures.jsonl
```

## 版权

代码、角色、插画、文案与品牌资产的权利由项目作者保留。公开仓库不代表授予他人商业使用这些资产的许可。
