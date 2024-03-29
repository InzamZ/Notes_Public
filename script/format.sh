#!/bin/bash
echo "尝试使用 zhlint 格式化所有 markdown 文档"

cnt=0
# 递归遍历所有 markdown 文件
for file in `(find ./docs -name "**.md")`; do
    if [[ "${file:0:11}" == "./docs/XCPC" ]]; then
        continue
    fi
    zhlint $file >/dev/null 2>&1
    if [ $? -eq 1 ]; then
        echo "正在格式化 $file"
        zhlint $file --fix >/dev/null 2>&1
        let cnt+=1
    fi
done

echo "格式化完成，共格式化 $cnt 个文件"