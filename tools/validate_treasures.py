#!/usr/bin/env python3
import json
import sys
from pathlib import Path


def main() -> int:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else 'data/treasures.jsonl')
    seen = set()

    for line_number, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        if not line.strip():
            continue
        item = json.loads(line)
        missing = {'text', 'image_url', 'category', 'id_code'} - item.keys()
        if missing:
            raise ValueError(f'第 {line_number} 行缺少字段: {sorted(missing)}')
        if item['id_code'] in seen:
            raise ValueError(f'第 {line_number} 行 id_code 重复: {item["id_code"]}')
        seen.add(item['id_code'])

    print(f'校验通过：{len(seen)} 条卡片数据')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
