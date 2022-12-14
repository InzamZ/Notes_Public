---
title: UESTC第20届程序设计大赛
tags:
  - 贪心
  - 数学
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---

# UESTC 第 20 届程序设计大赛

## DAY0 环节

这次比赛很幸运能约到老同学 ly，我初三的暑假开始接触 OI，夏令营就和 ly 一起，还是上下铺。加上新认识的大一学弟，这次真的是队友最强了，也是希望能够有个好成绩。

## J - Thesis Format Checking

### 题目大意

给定论文类型，还有相关属性，按照规定判断字数是否合法。

### 解题思路

处理输入的字符串，然后判断即可，这是一道没有技巧的签到题。

### 场内花絮

众所周知，签到题要从后往前找。所以最后一题 ly 很快就找到了，但奈何这个家伙用 cin 写炸了，导致甚至错了 2 发。当时我已经发现了 F 题可以写了，很急，就说算了我重写算了，所以我用 scanf 重写了一次过了。

## F - Pattern Lock Checker

### 题目大意

手势解锁的背景，解锁手机可以在点阵上画图案，这里题目给出一个$n \times m$点阵，给出一个手势序列，按照经过点的先后顺序给出，要求判断密码手势是合法的，非法的还是强度高的。

合法手势至少要有三个点，相邻点之间的连线不可与其他点重合。每个点经过至多一次。强度高的手势要求在合法手势基础上，经过每一个点，并且相邻的连线之间连线必须是锐角。

### 解题思路

判断是否线经过点，可以判断两点横向之差和纵向之差的最小公约数是否为 1，如果不为 1 则会经过点。随后判断锐角需要使用向量点积公式，判断向量夹角是否为锐角。

### 场内花絮

在第一题通过到此题解出，我们共计花费100分钟，也就是快两个小时。当时 J 完成后我就开始写 F，但是由于向量公式太久没用，一时推导不出来。然后 ly 说 C 题是可以写的，所以让给他，我继续推一下公式。他的 C 写完后也是错了两次，随后换上 zbl 开始写 A，我们才看出代码的错误之处。首先是忽略了经过点数至少三个点，还有最后经过一个点的标记也忘记打了。

## C - Black Magic

### 题目大意

有四种方块，分别是两边都是白色的 E，两边都是黑色的 B，左边是黑右边是白 L，左边是白右边是黑 R。方块不是旋转，并且相邻方块的边缘颜色相同，可以将两方块拼接在一起。问要使得方块最少和最多各是多少。

### 解题思路

首先，简单的是最少，由于黑色边可以合并，于是可以选取两边 B 方块，这些可以合成一块 B，而这一块可以和 L 或者 R 合并并不改变 L 或 R 数量。L 和 R 之间两两结合可以变成 E，最少的问题使用贪心即可。

最多的问题在于如何保全 B 方块，首先 L 与 R 方块可以全部保全，将 L 全部放在左侧，R 全在右侧，此时可以放下一个 B 方块，随后为了保全一个 B 方块需要使用一个 E 方块放在其中。

### 场内花絮

ly 的思路大致正确，一开始是有个细节没有考虑到，后面错误是因为懒得写分支语句，以及表达式过于冗余，最后化简后就过了，此时大概是比赛过半，三题队伍已是不少。随后换上 zbl 继续解决 A 题，我们开始考虑 B 题。

## B - Wall Builder II

### 题目大意

你有一些石砖，要砌一堵墙，有 n 种砖块，长度为 i 高度为 1 的有$n + 1 - i$块，要求砌墙必须是严格的矩形墙，并且要求周长最小，所有砖块必须用上。

### 解题思路

数据范围很小，只需要算出面积，然后枚举长宽进行判断即可。如何判断，使用贪心。我们优先放置长的砖块，这样是最优解法，因为长的砖块可以用短的拼成，但是长的不能拆分，因此能用大的就用大的。

### 场内花絮

跟榜的题目，看了一下发现可以写了，而且也非常顺利。

## I - Independent Feedback Vertex Set

### 题目大意

给一张图，要求分成森林和独立点集合，独立点集合指的是集合中所有的点两两之间没有直接相连的边。要求使得独立点集合的点权值之和最大。这是一个 NP 问题，因此题目给出图的方式经过优化，一开始只有三个点互相连接，选取已有两个点，将一个新点与两者连接，最后形成图。

### 解题思路

思路就在额外的条件，首先一开始每个点都至少有两个点相连，此时增加一个点，会选取两个点，这两个点必定是相连的，加入点必定会形成环，因此如果选择的两个点都在森林，那么这个点必定不能放在森林中。两个点分居两侧，这个点放在独立点集合会有两两连接点出现，将独立点集合的点换会必定会出现环，因为这个点添加的时候就注定有一个三点环，加入独立点集合意味着其余两点都在森林。所以所有的结论推向一个结果，每次加入一个点，放在何处都是固定的，只需要枚举一开始三个点哪个放入独立点集合就好了。

### 场内花絮

一开始我和 ly 有两种思路，一种是最小生成树，但我觉得有点奇怪，后续由于是森林而向另一个思路 dp 转移。我们根据加点方式按照选择的两个点的情况进行分类，最后困难全部归结于将点放回森林是否有环。最后我突发奇想，发现换进去必定有环，将 dp 状态简化后，发现转移状态只有一种，根本就是确定的，敲完代码只用5分钟，甚至不敢相信，结果过题了，特别高兴。

## A - Wall Builder I

### 题目大意

有一间房间，在边界处有若干个点，可以修一堵墙直到遇到一堵墙或者边界就停止。你可以随意安排建墙顺序，最后需要计算出可能的最大的房间面积。

### 解题思路

方案按照最后房间边界的数量分类，随后取最大值就可以。本题简单的是思路，随后编写的难度就会比较难。

### 场内花絮

此题就是 zbl 唯一一道书写的题目了，其实思路没有太大问题，但是最后也是有地方写错了。最后半小时全力 debug 也没有成功，可惜了。

## 后记

这是第三次打校赛了，也是两个队友都是十分给力。zbl 虽然没有写出 A 题，但是也给我们的部分题目一起参考思路，ly 虽然退役许久，但是这次题目也确实没有什么难题，大多是思维题目。没有什么复杂数据结构，也许就是校赛的难度定位问题吧，感觉更多是定位在 codeforces div2。比赛只是起点，我也有幸结识了两位队友，以后可以一起打比赛了。
