---
title: 力扣周赛331
lang: zh-CN
date: 2023-02-05
update: 2023-02-05
tags:
  - 贪心
  - 前缀和
  - 二分
description: 作息时间一直有问题，今天第一次尝试调节，貌似状态不太好，题意都经常读挂


---



# 力扣周赛331

## A - [6348 从数量最多的堆取走礼物](https://leetcode.cn/problems/take-gifts-from-the-richest-pile/)

因为 `floor` 缺失导致卡壳。

### 参考代码

```cpp
//InzamZ
//
#include <bits/stdc++.h>
using namespace std;

class Solution {
  public:
    long long pickGifts(vector<int> &gifts, int k) {
        priority_queue<int>q;
        long long ans = 0;
        for (auto x : gifts) {
            q.push(x);
            ans += x;
        }
        for (int i = 1; i <= k; ++i) {
            int cnt = q.top();
            cnt = cnt - floor(sqrt(cnt)); [[ code ]]
            ans -= cnt;
            cnt = q.top() - cnt;
            q.pop();
            cout << cnt << endl;
            q.push(cnt);
        }
        return ans;
    }
};

#ifdef LOCALLC
int main() {
    Solution sol;
    return 0;
}
#endif
```

## B - [6347 统计范围内的元音字符串数](https://leetcode.cn/problems/count-vowel-strings-in-ranges/)

因为 `else if` 分支错误导致错误。

### 参考代码

```cpp
//InzamZ
//
#include <bits/stdc++.h>
using namespace std;

class Solution {
  public:
    int cnt[100010];
    vector<int> vowelStrings(vector<string> &words, vector<vector<int>> &queries) {
        char ch[5] = {'a', 'e', 'i', 'o', 'u'};
        for (int i = 0; i < words.size(); ++i ) {
            int len = words[i].size();
            int flag1 = 0, flag2 = 0;
            for (int k = 0; k < 5; ++k) {
                if (words[i][0] == ch[k])
                    flag1 = 1;
                else if (words[i][len - 1] == ch[k]) // [!code --]
                if (words[i][len - 1] == ch[k]) // [!code ++]
                    flag2 = 1;
            }
            if (flag1 && flag2)
                cnt[i]++;
            if (i)
                cnt[i] += cnt[i - 1];
            cout << cnt[i] << endl;
        }
        vector<int>ans;
        for (auto x : queries) {
            int l = x[0], r = x[1];
            if (l == 0)
                ans.push_back(cnt[r]);
            else
                ans.push_back(cnt[r] - cnt[l - 1]);
            // if (l) cout << cnt[r] << " " << cnt[l - 1] << endl;
            // else cout << cnt[r] << endl;
        }
        return ans;
    }
};

#ifdef LOCALLC
int main() {
    Solution sol;
    vector<string> words ({"aba", "bcb", "ece", "aa", "e"});
    vector<vector<int>> queries ({{0, 2}, {1, 4}, {1, 1}});
    sol.vowelStrings(words, queries);
    return 0;
}
#endif
```

## C - [6346. 打家劫舍 IV](https://leetcode.cn/problems/house-robber-iv/)

### 题目大意（误）

现在有一个窃贼，准备行窃，他的能力是 $k$，可以行窃至多 $k$ 间屋子。相邻屋子有防盗措施，因此他不会同时盗窃相邻两间屋子，请问他最多可以行窃的金额。

这大概就是我读挂的题意吧，事实上利用前缀的思路，可以解决，但是复杂度是 $N^2$。

### 题目大意

现在有一个窃贼，准备行窃，他的能力是 $t$，在单间屋子的最多行窃的财物为 $t$，相邻屋子有防盗装置，盗贼无法盗窃相邻的屋子。盗贼至少需要盗窃 $k$ 个屋子。

### 解题思路

二分答案，枚举盗贼的能力 $t$，然后贪心，如果盗贼能够盗窃就盗窃，随后由于相邻的限制，跳过下一个。

### 参考代码

```cpp
//InzamZ
//
#include <bits/stdc++.h>
using namespace std;

class Solution {
  public:
    int minCapability(vector<int> &nums, int k) {
        int n = nums.size();
        auto check = [ = ] (int x) {
            int cnt = 0;
            for (int i = 0; i < n; ++i) {
                if (nums[i] <= x) {
                    cnt++;
                    ++i;
                }
            }
            cout << x << " " << cnt << endl;
            return cnt < k;
        };
        int l = 0, r = 1e9 + 1;
        while (l + 1 < r) {
            int mid = (l + r) >> 1;
            if (check(mid))
                l = mid;
            else
                r = mid;
        }
        return r;
    }
};

#ifdef LOCALLC
int main() {
    Solution sol;
    return 0;
}
#endif
```

## D - [6345. 重排水果](https://leetcode.cn/problems/rearranging-fruits/)

### 题目大意

交换水果使得两个数组排序后相同，交换水果的代价是两个水果的最小值，求最小代价，不能完成输出 $-1$。

### 解题思路

判断是否有解比较简单，统计每个数字的出现次数，两个数组的差值为 $2$ 的倍数。否则无解。

代价最小需要维护一个优先队列，两个的优先级需要相反，这样才最优。但是有一个特殊步骤，就是你可以使用一个小的数，交换两次达到相同的效果，因此需要考虑。

```cpp
//InzamZ
//
#include <bits/stdc++.h>
using namespace std;

class Solution {
  public:
    map<long long, long long>mp1, mp2;
    long long minCost(vector<int> &basket1, vector<int> &basket2) {
        long long minx = 1e9;
        for (auto x : basket1) {
            mp1[x]++;
            minx = min(minx, 1ll * x);
        }
        for (auto x : basket2) {
            mp2[x]++;
            minx = min(minx, 1ll * x);
        }
        long long ans = 0, ok = 0;
        bool flag = 1;
        priority_queue<long long>q1;
        priority_queue<long long,vector<long long>, greater<long long>>q2;
        for (auto x : basket1) {
            if ((mp1[x] - mp2[x]) % 2 == 1) {
                flag = 0;
                break;
            }
            else if (mp1[x] - mp2[x] > 0) {
                mp1[x]--;
                mp2[x]++;
                q1.push(x);
            }
            else if (mp1[x] - mp2[x] < 0) {
                mp1[x]++;
                mp2[x]--;
                q2.push(x);
            }
        }
        for (auto x : basket2) {
            if ((mp1[x] - mp2[x]) % 2 == 1) {
                flag = 0;
                break;
            }
            else if (mp1[x] - mp2[x] > 0) {
                mp1[x]--;
                mp2[x]++;
                q1.push(x);
            }
            else if (mp1[x] - mp2[x] < 0) {
                mp1[x]++;
                mp2[x]--;
                q2.push(x);
            }
        }
        if (flag)
        {
            while(!q1.empty() && !q2.empty())
            {
                ans += min(minx * 2,min(q1.top(), q2.top()));
                q1.pop();
                q2.pop();
            }
        }
        if (flag && ok == 0)
            return ans;
        else
            return -1;
    }
};

#ifdef LOCALLC
int main() {
    Solution sol;
    // [4,2,2,2]
    // [1,4,1,2]
    vector<int>v1 = {4, 2, 2, 2};
    vector<int>v2 = {1, 4, 1, 2};
    cout << sol.minCost(v1, v2) << endl;
    return 0;
}
#endif
```

以上