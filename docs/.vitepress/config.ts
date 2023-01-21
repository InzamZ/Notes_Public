import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'

const customElements = [
  'math',
  'maction',
  'maligngroup',
  'malignmark',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mi',
  'mlongdiv',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'ms',
  'mscarries',
  'mscarry',
  'mscarries',
  'msgroup',
  'mstack',
  'mlongdiv',
  'msline',
  'mstack',
  'mspace',
  'msqrt',
  'msrow',
  'mstack',
  'mstack',
  'mstyle',
  'msub',
  'msup',
  'msubsup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'semantics',
  'math',
  'mi',
  'mn',
  'mo',
  'ms',
  'mspace',
  'mtext',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'msqrt',
  'mstyle',
  'mmultiscripts',
  'mover',
  'mprescripts',
  'msub',
  'msubsup',
  'msup',
  'munder',
  'munderover',
  'none',
  'maligngroup',
  'malignmark',
  'mtable',
  'mtd',
  'mtr',
  'mlongdiv',
  'mscarries',
  'mscarry',
  'msgroup',
  'msline',
  'msrow',
  'mstack',
  'maction',
  'semantics',
  'annotation',
  'annotation-xml'
]

export default defineConfig({
    lang: 'zh-CN',
    lastUpdated: true,
    markdown: {
        config: (md) => {
            // use more markdown-it plugins!
            md.use(require('markdown-it-task-lists'))
            md.use(markdownItKatex)
        }
    },
    // 由于vitepress编译生成静态html文件时，无法识别插件生成的特殊标签，故需在编译时进行处理，将特殊标签定位自定义标签，防止编译报错
    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => customElements.includes(tag)
            }
        }
    },
    head: [
        ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css', crossorigin: '' }]
    ],
    themeConfig: {
        outline: [2, 3],
        lastUpdatedText: '最近更新',
        nav: [{
            text: '课程笔记',
            items: [
                { text: '计算机网络', link: '/CoursesNotes/计算机网络/第一章_计算机网络体系结构' },
                { text: '网络攻防技术', link: '/CoursesNotes/网络攻防技术/第4章_传输层安全协议TLS' },
            ]
        },
        {
            text: '读书笔记',
            items: [{
                text: '技术类笔记',
                items: [
                    { text: 'Linux 内核设计与实现', link: '/ReadingNotes/Linux内核设计与实现/' },
                    { text: 'C++ Primer Plus (第6版) 中文版', link: '/ReadingNotes/C++_Primer_Plus/' },
                ]
            },
            {
                text: '文学类笔记', items: [
                ]
            }
            ]
        },
        {
            text: 'XCPC',
            items: [
                { text: 'Atcoder', link: '/XCPC/Atcoder/' },
                { text: 'CodeChef', link: '/XCPC/CodeChef/' },
                { text: 'Codeforces', link: '/XCPC/Codeforces/' },
                { text: 'Lanqiao', link: '/XCPC/Lanqiao/lanqiao2022_regional_CA' },
                { text: 'Leetcode', link: '/XCPC/Leetcode/' },
                { text: '学习笔记', link: '/XCPC/Note/' },
                { text: '其他', link: '/XCPC/Other/' },
            ]
        },
        {
            text: '其他内容',
            items: [
                { text: 'C++后端开发面试题与知识点汇总', link: '/Other/Cpp_Interview_Summary' },
            ]
        },
        ],
        sidebar: {
            '/CoursesNotes/': [{
                text: 'CoursesNotes',
                items: [
                    { text: 'CoursesNotes', link: '/CoursesNotes/' },
                    { text: '计算机网络', link: '/CoursesNotes/计算机网络/第一章_计算机网络体系结构' },
                    { text: '网络攻防技术', link: '/CoursesNotes/网络攻防技术/第4章_传输层安全协议TLS' },
                ]
            }],
            '/CoursesNotes/计算机网络/': [{
                text: '计算机网络',
                items: [
                    { text: '计算机网络', link: '/CoursesNotes/计算机网络/第一章_计算机网络体系结构' },
                    { text: '第一章：计算机网络体系结构', link: '/CoursesNotes/计算机网络/第一章_计算机网络体系结构' },
                    { text: '第五章：传输层', link: '/CoursesNotes/计算机网络/第五章_传输层' },
                ]
            }],
            '/CoursesNotes/网络攻防技术/': [{
                text: '网络攻防技术',
                items: [
                    { text: '网络攻防技术', link: '/CoursesNotes/网络攻防技术/第4章_传输层安全协议TLS' },
                    { text: '第4章：传输层安全协议 TLS', link: '/CoursesNotes/网络攻防技术/第4章_传输层安全协议TLS' },
                    { text: '第5章：无线局域网安全 WLAN', link: '/CoursesNotes/网络攻防技术/第5章_无线局域网安全WLAN' },
                    { text: '第6章：渗透测试 - 情报收集技术', link: '/CoursesNotes/网络攻防技术/第6章_渗透测试-情报收集技术' },
                    { text: '第6章：渗透测试 - 漏洞扫描技术', link: '/CoursesNotes/网络攻防技术/第6章_渗透测试-漏洞扫描技术' },
                    { text: '第6章：渗透测试 - Metasploit 框架', link: '/CoursesNotes/网络攻防技术/第6章_渗透测试-Metasploit框架' },
                    { text: '第7章：软件安全 - 漏洞挖掘与利用', link: '/CoursesNotes/网络攻防技术/第7章_软件安全-漏洞挖掘与利用' },
                    { text: '第7章：软件安全 - 缓冲区溢出', link: '/CoursesNotes/网络攻防技术/第7章_软件安全-缓冲区溢出' },
                ]
            }],
            '/ReadingNotes/': [{
                text: 'ReadingNotes',
                items: [
                    { text: 'ReadingNotes', link: '/ReadingNotes/' },
                    { text: 'Linux 内核设计与实现', link: '/ReadingNotes/Linux内核设计与实现/' },
                    { text: 'C++ Primer Plus (第6版) 中文版', link: '/ReadingNotes/C++_Primer_Plus/' },
                ]
            }],
            '/ReadingNotes/Linux内核设计与实现/': [{
                text: 'Linux 内核设计与实现',
                items: [
                    { text: 'Linux 内核设计与实现', link: '/ReadingNotes/Linux内核设计与实现/' },
                    { text: '第一章：Linux 内核简介', link: '/ReadingNotes/Linux内核设计与实现/第一章_Linux内核简介' },
                    { text: '第二章：从内核出发', link: '/ReadingNotes/Linux内核设计与实现/第二章_从内核出发' },
                    { text: '第三章：进程管理', link: '/ReadingNotes/Linux内核设计与实现/第三章_进程管理' },
                ]
            }],
            '/ReadingNotes/C++_Primer_Plus/': [{
                text: 'C++ Primer Plus',
                items: [
                    { text: 'C++ Primer Plus (第6版) 中文版', link: '/ReadingNotes/C++_Primer_Plus/' },
                    { text: '第10章：对象与类', link: '/ReadingNotes/C++_Primer_Plus/第10章_对象与类' },
                ]
            }],
            '/XCPC/Atcoder/': atcoder_sidebar(),
            '/XCPC/CodeChef/': codechef_sidebar(),
            '/XCPC/Codeforces/': codeforces_sidebar(),
            '/XCPC/Lanqiao/': lanqiao_sidebar(),
            '/XCPC/Leetcode/': leetcode_sidebar(),
            '/XCPC/Note/': note_sidebar(),
            '/XCPC/Other/': other_sidebar(),
            '/Other': [{
                text: '其他内容',
                items: [
                    { text: 'C++后端开发面试题与知识点汇总', link: '/Other/Cpp_Interview_Summary' },
                ]
            }],
        }
    }
})

function atcoder_sidebar() {
    return [{
        text: 'Atcoder',
        items: [
            { text: 'Atcoder', link: '/XCPC/Atcoder/' },
            { text: 'Atcoder Beginner Contect 182', link: '/XCPC/Atcoder/ABC182' },
            { text: 'Atcoder Beginner Contect 188', link: '/XCPC/Atcoder/ABC188' },
            { text: 'Atcoder Beginner Contect 189', link: '/XCPC/Atcoder/ABC189' },
            { text: 'Atcoder Beginner Contect 244', link: '/XCPC/Atcoder/ABC244' },
            { text: 'Atcoder Beginner Contect 245', link: '/XCPC/Atcoder/ABC245' },
            { text: 'Atcoder Beginner Contect 247', link: '/XCPC/Atcoder/ABC247' },
            { text: 'Atcoder Beginner Contect 250', link: '/XCPC/Atcoder/ABC250' },
            { text: 'Atcoder Regular Contect 106', link: '/XCPC/Atcoder/ARC106' },
            { text: 'AtCoder Regular Contest 116', link: '/XCPC/Atcoder/ARC116' },
            { text: 'AtCoder Regular Contest 147', link: '/XCPC/Atcoder/ARC147' },
            { text: 'AtCoder Regular Contest 148', link: '/XCPC/Atcoder/ARC148' },
            { text: 'Atcoder Education DP Contest', link: '/XCPC/Atcoder/EducationDPContest' },
            { text: 'KEYENCE Programming Contest 2021', link: '/XCPC/Atcoder/keyence2021' }
        ]
    }]
}

function codechef_sidebar() {
    return [{
        text: 'CodeChef',
        items: [
            { text: 'CodeChef', link: '/XCPC/CodeChef/' },
            { text: 'STARTER39', link: '/XCPC/CodeChef/STARTER39' }
        ]
    }]
}

function codeforces_sidebar() {
    return [{
        text: 'Codeforces',
        items: [
            { text: 'Codeforces', link: '/XCPC/Codeforces/' },
            { text: 'Codeforces Round 684 (Div.2)', link: '/XCPC/Codeforces/CF1440_R684' },
            { text: 'Codeforces Round 685 (Div.2)', link: '/XCPC/Codeforces/CF1451_R685' },
            { text: 'Educational Codeforces Round 98', link: '/XCPC/Codeforces/CF1452_EDU98' },
            { text: 'Codeforces Round 691 (Div.2)', link: '/XCPC/Codeforces/CF1459_R691' },
            { text: 'Codeforces Round 690 (Div.3)', link: '/XCPC/Codeforces/CF1462_R690' },
            { text: 'Educational Codeforces Round 100', link: '/XCPC/Codeforces/CF1463_EDU100' },
            { text: 'Deltix Round, Autumn 2021', link: '/XCPC/Codeforces/CF1609-DR-Aut2021' },
            { text: 'Educational Codeforces Round 118', link: '/XCPC/Codeforces/CF1613-Edu118' },
            { text: 'Educational Codeforces Round 124', link: '/XCPC/Codeforces/CF1651-Edu124' },
            { text: 'Codeforces Round 779 (Div.2)', link: '/XCPC/Codeforces/CF1658_R779' },
            { text: 'Codeforces Round 783 (Div.2)', link: '/XCPC/Codeforces/CF1668_R783' },
            { text: 'Educational Codeforces Round 127', link: '/XCPC/Codeforces/CF1671_Edu127' },
            { text: 'Codeforces Round 787 (Div.3)', link: '/XCPC/Codeforces/CF1675_R787' },
            { text: 'Codeforces Round 819 (Div.1 + Div.2)', link: '/XCPC/Codeforces/CF1726_R819' },
            { text: 'Educational Codeforces Round 135', link: '/XCPC/Codeforces/CF1728_Edu135' },
            { text: 'CodeTON Round 3 (Div.1 + Div.2)', link: '/XCPC/Codeforces/CF1750_TON3' }
        ]
    }]
}

function lanqiao_sidebar() {
    return [{
        text: 'Lanqiao',
        items: [
            { text: '第十三届蓝桥杯省赛 C/C++ A组', link: '/XCPC/Lanqiao/lanqiao2022_regional_CA' }
        ]
    }]
}

function leetcode_sidebar() {
    return [{
        text: 'Leetcode',
        items: [
            { text: 'Leetcode', link: '/XCPC/Leetcode/' },
            { text: 'LeetCodeCup_2022Spring', link: '/XCPC/Leetcode/LeetCodeCup_2022Spring' },
            { text: 'LeetCodeWeeklyContest291', link: '/XCPC/Leetcode/LeetCodeWeeklyContest291' },
            { text: 'LeetCodeWeeklyContest292', link: '/XCPC/Leetcode/LeetCodeWeeklyContest292' },
        ]
    }]
}

function note_sidebar() {
    return [{
        text: 'Note',
        items: [
            { text: '笔记', link: '/XCPC/Note/' },
            { text: 'QuickSort', link: '/XCPC/Note/Quicksort' },
            { text: 'SortAlgorithm', link: '/XCPC/Note/SortAlgorithm' }
        ]
    }]
}

function other_sidebar() {
    return [{
        text: 'Other',
        items: [
            { text: '其他内容', link: '/XCPC/Other/' },
            { text: 'UESTCPC2022', link: '/XCPC/Other/UESTCPC2022' },
        ]
    }]
}