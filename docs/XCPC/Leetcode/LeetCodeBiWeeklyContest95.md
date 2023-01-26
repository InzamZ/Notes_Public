---
title: 力扣双周赛 95
lang: zh-CN
tags:
  - 贪心
  - 哈希
description: 力扣双周赛 95

---

# {{$frontmatter.title}}

## A - 2525 根据规则将箱子分类

### 题目大意

根据规则将箱子分类，输出对应的类型。

### 参考代码

```cpp
class Solution {
  public:
    string categorizeBox(int length, int width, int height, int mass) {
        bool b = 0, c = 0;
        if (length >= 10000 || width >= 10000 || height >= 10000 || 1ll * length * width * height >= 1000000000)
            b = 1;
        if (mass >= 100)
            c = 1;
        if (b && c) return "Both";
        else if (b) return "Bulky";
        else if (c) return "Heavy";
        else return "Neither";
    }
};
```

## B - 2526 找到数据流中的连续整数

### 题目大意

给定一个数据流，找到数据流结尾是否为指定的连续的整数。

### 参考代码

```cpp
class DataStream {
  private:
    int val, k;
    queue<int> q;
    map<int, int> mp;
  public:
    DataStream(int value, int k) {
        val = value;
        this->k = k;
    }

    bool consec(int num) {
        q.push(num);
        mp[num]++;
        if (q.size() > k) {
            mp[q.front()]--;
            q.pop();
        }
        if (q.size() == k) {
            if (mp[val] == k) return true;
        }
        return false;
    }
};

/**
 * Your DataStream object will be instantiated and called as such:
 * DataStream* obj = new DataStream(value, k);
 * bool param_1 = obj->consec(num);
 */
```

