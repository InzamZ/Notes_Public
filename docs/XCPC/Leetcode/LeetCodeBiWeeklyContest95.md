---
title: 力扣双周赛 95
lang: zh-CN
date: 2023-01-26
update: 2023-01-27
tags:
  - 贪心
  - 模拟
  - 数论
  - 二分答案
  - 差分
description: 力扣双周赛 95

---

# {{$frontmatter.title}}

这次是我目前最好成绩了，但是第一题看错题目，体积没算进去；第三题猜到结论，直接秒杀；比较遗憾的还是第四题吧，因为边界问题卡了很久，思路是没问题的。

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
= \  &( ( nums_i \ \& \ nums_k )  \oplus (( nums_j \ \& \ nums_k ) \mid ( nums_i\  \& \ nums_k ) ) ) \\
  \  & \mid ( ( nums_j\  \& \ nums_k ) \oplus (( nums_j \ \& \ nums_k ) \mid ( nums_i\  \& \ nums_k ) ) )\\
= \  &( ( nums_i \ \& \ nums_k )  \oplus ( nums_j \ \& \ nums_k ) ) \mid ( ( nums_j\  \& \ nums_k ) \oplus ( nums_i \ \& \ nums_k  ) )\\
= \  &( nums_i \ \& \ nums_k )  \oplus ( nums_j \ \& \ nums_k )
\end{aligned}
$$

其实化简过程我们可以发现，这个式子最后会出现很多重复项，此时异或值会变成 $0$。我当时没有多想，直觉告诉我就是只有三个相等的时候会出现找不到一对的情况。结果赛后我发现我也证不出来。

### 参考代码

```cpp
//InzamZ
//
#include <bits/stdc++.h>
using namespace std;

class Solution {
  public:
    int xorBeauty(vector<int> &nums) {
        int ans = 0;
        for (auto v : nums)
            ans ^= v;
        return ans;
    }
};

int main() {
    Solution sol;
    return 0;
}
```

## D - [2528 最大化城市的最小供电站数目](https://leetcode.cn/problems/maximize-the-minimum-powered-city/)

### 题目大意

有 $n$ 个城市，从 $0$ 开始编号，每个城市初始有 $\text{stations}_i$ 座发电站，发电站的作用范围是左边和右边各 $r$ 个单位。一座城市的电量是能给其供电的发电站数量。你可以修建 $k$ 座额外的发电站，你的任务是最大化最小电量城市的电量。

### 解题思路

这道题之前做过，`UESTC` 的数据结构集训题有一道类似的题，一道差分加二分搜索的题目。

首先二分搜索答案，验证能不能使答案为二分值。每次验证答案需要利用差分思想，一座发电站的作用范围是一条线段，因此我们在线段开头加上正值，在线段结束后一个单位加上负值，这样不断累加的结果就是城市的电量了。

如果当前城市的电量小于二分答案，说明需要额外的发电站。根据贪心的思想，之前的城市都不缺电，放在现在的城市显然浪费了左边的供电，因此应该放在 $cur+r$ 的位置，此时发电站刚好供应到当前缺电的城市，作用范围又最大。注意此时新加入的发电站的作用范围终点后一个单位需要减去额外添加的发电站数量。如果额外发电站数量超过规定数量，那么答案不满足；反之当前答案满足。

### 参考代码

```cpp
//InzamZ
//
#include <bits/stdc++.h>
using namespace std;

class Solution {
  public:
    long long cnt[100005], cnttmp[100005];
    long long maxPower(vector<int> &stations, int r, int k) {
        long long ll = 0, rr = 1e18;
        long long siz = stations.size();
        for (int i = 0; i <= siz; ++i)
            cnttmp[i] = cnt[i] = 0;
        for (long long i = 0; i < stations.size(); ++i) {
            cnt[max(0ll, i + 1 - r)] += stations[i];
            cnt[min(siz + 1, i + r + 2)] -= stations[i];
        }
        long long kk;
        long long mid = (ll + rr) / 2,cur = 0;
        bool check;
        for (int i = 0; i <= siz; ++i) {
            cnttmp[i] = cnt[i];
        }
        while (ll + 1 < rr) {
            mid = (ll + rr) / 2;
            check = 1;
            kk = k;
            for (int i = 0; i <= siz; ++i) {
                cnt[i] = cnttmp[i];
            }
            cur = cnt[0];
            for (long long i = 1; i <= siz; ++i) {
                cur += cnt[i];
                if (cur < mid) {
                    kk -= mid - cur;
                    cnt[min(i + 1 + 2 * r, siz + 1)] -= mid - cur;
                    cur = mid;
                }
                if (kk < 0) {
                    check = 0;
                    break;
                }
            }
            if (check)
                ll = mid;
            else
                rr = mid;
        }
        return ll;
    }
};

int main() {
    Solution sol;
    vector<int>stations = {1, 2, 4, 5, 0};
    int r = 1, k = 2;
    cout << sol.maxPower(stations, r, k);
    return 0;
}
```

以上