---
title: 力扣双周赛 97
lang: zh-CN
date: 2023-02-06
update: 2023-02-06
tags:
  - 贪心
  - 模拟
  - BFS
description: 很差，最后第三题也没有写完，状态不佳

---

# {{$frontmatter.title}}

很差，最后第三题也没有写完，状态不佳。

## A - [6303 分割数组中数字的数位](https://leetcode.cn/problems/separate-the-digits-in-an-array/)

### 题目大意

拆分数组中的数字的每一位。

### 参考代码

```cpp
class Solution {
public:
    vector<int> separateDigits(vector<int>& nums) {
        stack<int>q;
        vector<int>v;
        for(auto x: nums)
        {
            while (x)
            {
                q.push(x % 10);
                x /= 10;
            }
            while (!q.empty())
            {
                v.push_back(q.top());
                q.pop();
            }
        }
        return v;
    }
};
```

## B - [6304 从一个范围内选择最多整数 I](https://leetcode.cn/problems/maximum-number-of-integers-to-choose-from-a-range-i/)

### 题目大意

选取 $[1,n]$ 之间的整数，最大和不超过 $maxSum$，有部分数字不可选择，问最多选择的数字。

### 参考代码

```cpp
//InzamZ
//
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int vis[10010];
    int maxCount(vector<int>& banned, int n, int maxSum) {
        int ans = 0;
        for (int i = 0; i <= n; ++i) vis[i] = 0;
        for (auto x: banned) vis[x] = 1;
        for (int i = 1; i <= n && maxSum >= i; ++i)
        {
            if (vis[i]) continue;
            ++ans;
            maxSum -= i;
        }
        return ans;
    }
};
```

## C - [2555 两个线段获得的最多奖品](https://leetcode.cn/problems/maximize-win-from-two-segments/)

### 题目大意

给定一个数组 `prizePositions` 代表第 `i` 个奖品的位置，你可以选择两个长度为 $k$ 的区间获取所有的玩具，包括端点，问获取的最多奖品数。保证数组 `prizePositions` 是非降序的。

### 解题思路

判断每个数的前后 $k$ 范围内的奖品数，利用前缀后缀取最大值，代表在这个数之前其他区间的最大值。计算可以使用优先队列，统计之前将队列中不在范围的去除，由于原本保证有序，去除队列前不在范围内的数字就均为合法的了。

### 参考代码

```cpp
class Solution {
  public:
    int pre[100010], suf[100010];
    int maximizeWin(vector<int> &prizePositions, int k) {
        int n = prizePositions.size(), ans = 0;
        for (int l = 0, r = 0 ; r < n; ++r) {
            while (prizePositions[r] - k > prizePositions[l])
                ++l;
            pre[r] = r - l + 1;
            if (r) pre[r] = max(pre[r], pre[r - 1]);
        }
        for (int l = n - 1, r = n - 1; l >= 0; --l) {
            while (prizePositions[l] + k < prizePositions[r])
                --r;
            suf[l] = r - l + 1;
            if (l < n - 1) suf[l] = max(suf[l], suf[l + 1]);
        }
        suf[n] = 0;
        for (int i = 0; i < n; ++i)
            ans = max(ans, pre[i] + suf[i + 1]);
        return ans;
    }
};
```

## D - [2556. 二进制矩阵中翻转最多一次使路径不连通](https://leetcode.cn/problems/disconnect-path-in-a-binary-matrix-by-at-most-one-flip/)

### 题目大意

给定一张图，从左上角出发，到达右下角，标记为 $0$ 的不可通行，且只能往下和右。你可以翻转一个地面，问是否可以使得所有道路无法到达终点。

### 解题思路

首先的思路是，不能走回头路，那按照步数标记，如果有翻转一块就可以断掉所有道路，那必定有一个点是所有道路的必经之路上。但是可能有的格子不在通路，因此可以从终点跑一遍 `BFS`，同时计数每一个步数的对应格子数，最后判断是否有计数为 $1$ 的层数。

### 参考代码

```cpp
//InzamZ
#include <bits/stdc++.h>
using namespace std;
#define ll long long
class Solution {
  public:
    int cnt[100010];
    bool vis[1010][1010];
    bool isPossibleToCutPath(vector<vector<int>> &grid) {
        int m = grid.size(), n = grid[0].size();
        cout << m << " " << n << endl;
        queue<pair<int, int>>q;
        for (int i = 0; i < m + n - 2; ++i)
            cnt[i] = 0;
        q.push({m - 1, n - 1});
        while (!q.empty()) {
            int x = q.front().first, y = q.front().second;
            q.pop();
            if (vis[x][y])
                continue;
            vis[x][y] = 1;
            cnt[x + y]++;
            if (x - 1 >= 0 && grid[x - 1][y] == 1) {
                q.push({x - 1, y});
            }
            if (y - 1 >= 0 && grid[x][y - 1] == 1) {
                q.push({x, y - 1});
            }
        }
        for (int i = 1; i < m + n - 2; ++i) {
            if (cnt[i] <= 1)
                return true;
        }
        return false;
    }
};
#ifdef LOCALLC
int main() {
    Solution sol;
    vector<vector<int>> grid = {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}};
    sol.isPossibleToCutPath(grid);
    return 0;
}
#endif
```

以上