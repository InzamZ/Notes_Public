# Leetcode

力扣我认为是比较适合求职面试的算法的，难度比较适中，对于竞赛党难度太小，除了力扣杯。这点跟牛客是很不同的，牛客的挑战赛显然是给竞赛者准备的，当然两者在求职方面给人的帮助都是大的。

力扣的周赛分为周赛和双周赛，双周赛两周一次。力扣的提交方式也比较奇特，提交的是类，但是不需要处理输入输出，这里提供一个简单的模版，涉及大数组和函数定义以及主函数。

```cpp
class Solution {
  public:
  	int cnt[100010]; // [!code hl]
    int minCapability(vector<int> &nums, int k) {
        int ans = nums.size();
        auto check = [ = ] (int x) { // [!code hl]
            int cnt = 0; // [!code hl]
            for (int i = 0; i < n; ++i) { // [!code hl]
                if (nums[i] <= x) { // [!code hl]
                    cnt++; // [!code hl]
                    ++i; // [!code hl]
                } // [!code hl]
            } // [!code hl]
            return cnt < k; // [!code hl]
        }; // [!code hl]
        return ans; 
    }
};
#ifdef LOCALLC // [!code hl]
int main() {
    Solution sol;
    return 0;
}
#endif
```

## 主函数

对于主函数，其实不需要本地调试也不太需要，但是需要单独写见很难受，写着复制又不能全选。于是可以使用 `ifdef`，本地增加编译参数 `-DLOCALLC`，一个解决思路。

## 其他函数

所有数据都是参数的形式给出，在写一个公有函数需要传入参数（这是可行的，但是对于大数组需要传入引用，否则会出现超时），这很麻烦，不够优雅。于是可以在作用域定义匿名函数，于是不需要传入参数。
