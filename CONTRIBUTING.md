# 参与维护

## 内容更新流程

1. 将新卡片图片保存到 `assets/cards/` 的相应角色目录。
2. 上传图片到微信云存储。
3. 在 `data/treasures.jsonl` 末尾新增一行 JSON，不要加数组方括号或行尾逗号。
4. `id_code` 不得与已有卡片重复。
5. 在提交前运行：

   ```sh
   python3 tools/validate_treasures.py data/treasures.jsonl
   ```

6. 将新数据导入云数据库 `fantuan_treasures` 后，在微信开发者工具中预览。

## 发布前检查

- 首次访问导览可以完整走完。
- 关闭后能再次打开百宝箱。
- 每日第四次打开会显示休息提示。
- 卡片文字、图片和标签没有溢出或截断。
- 云数据库和云存储权限遵循最小必要原则。
