---
title: 力扣双周赛 95
lang: zh-CN
date: 2023-01-26
update: 2023-01-27
tags:
  - 贪心
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

## C - 2527 查询数组 Xor 美丽值

### 题目大意

给定一个整数数组，坐标从 0 开始，长度为 n $( 1 \leq n \leq 10^5)$ ，选定三个下标$i$,$j$,$k$,定义有效值为 $(\ (nums_i \mid nums_j) \  \& \ nums_k \ )$ ，计算出所有三元组$(0 \leq i,j,k \lt n)$ 的有效值的异或结果。

### 解题思路

数学题，需要对式子进行化简，最后计算结果即可。

$$
\begin{aligned}
&(( nums_i \mid nums_j)\ \& \ nums_k) \oplus ((nums_j \mid nums_i)\ \& \ nums_k) \\
= \  &(( nums_i \ \& \  nums_k ) \mid ( nums_j\ \&\ nums_k) ) \oplus (( nums_j\ \&\ nums_k ) \mid ( nums_i\ \&\ nums_k) ) \\
= \  &( ( ( nums_i \ \& \ nums_k )  \oplus (( nums_j \ \& \ nums_k ) \mid ( nums_i\  \& \ nums_k ) ) ) \\
  \  & \mid ( ( ( nums_j\  \& \ nums_k ) \oplus (( nums_j \ \& \ nums_k ) \mid ( nums_i\  \& \ nums_k ) ) )\\
= \  &( ( ( nums_i \ \& \ nums_k )  \oplus ( nums_j \ \& \ nums_k ) ) \mid ( ( ( nums_j\  \& \ nums_k ) \oplus ( nums_j \ \& \ nums_k  ) )\\
\end{aligned}
$$

化简后异或