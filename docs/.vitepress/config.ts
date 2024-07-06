import { defineConfig } from "vitepress"
import markdownItKatex from "markdown-it-katex"

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
    title: 'Misaka19614',
    markdown: {
        config: (md) => {
            // use more markdown-it plugins!
            md.use(require('markdown-it-task-lists'))
            md.use(markdownItKatex)
        }
    },
    cleanUrls: true,
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
        socialLinks: [
            { icon: 'github', link: 'https://github.com/InzamZ' },
        ],
        nav: nav(),
        sidebar: {
            '/AVDevelop/': av_develop_sidebar(),
            '/CoursesNotes/': courses_notes_sidebar(),
            '/CoursesNotes/计算机网络/': computer_network_sidebar(),
            '/CoursesNotes/操作系统/': operating_system_sidebar(),
            '/CoursesNotes/网络攻防技术/': network_security_sidbar(),
            '/ReadingNotes/': reading_notes_sidebar(),
            '/ReadingNotes/Linux内核设计与实现/': linux_kernel_sidebar(),
            '/ReadingNotes/C++_Primer_Plus/': cpp_primer_plus_sidebar(),
            '/ReadingNotes/CSAPP/': csapp_sidebar(),
            '/ReadingNotes/cpp_modern_approach/': cpp_modern_approach_sidebar(),
            '/ReadingNotes/操作系统概念/': os_concept_sidebar(),
            '/XCPC/Atcoder/': atcoder_sidebar(),
            '/XCPC/CodeChef/': codechef_sidebar(),
            '/XCPC/Codeforces/': codeforces_sidebar(),
            '/XCPC/Lanqiao/': lanqiao_sidebar(),
            '/XCPC/Leetcode/': leetcode_sidebar(),
            '/XCPC/Note/': xcpc_note_sidebar(),
            '/XCPC/NowCoder/': nowcoder_sidebar(),
            '/XCPC/Other/': xcpc_other_sidebar(),
            '/KindleNotes/': kindle_note_sidebar(),
            '/Other': others_sidebar()
        },
        algolia: {
            appId: 'CUWVNLJUM2',
            apiKey: '3e83db0b7ec52d583ac9ee2d4500f2e5',
            indexName: 'misaka19614'
        }
    }
})


function nav() {
    return [
        {
            text: '音视频开发',
            link: '/AVDevelop/'
        },
        {
            text: '课程笔记',
            items: [
                { text: '计算机网络', link: '/CoursesNotes/计算机网络/第一章_计算机网络体系结构.md' },
                { text: '操作系统', link: '/CoursesNotes/操作系统/1-计算机系统概述.md' },
                { text: '网络攻防技术', link: '/CoursesNotes/网络攻防技术/第4章_传输层安全协议TLS.md' },
                { text: '马克思主义基本原理', link: '/CoursesNotes/马克思主义基本原理/index.md' },
            ]
        },
        {
            text: '读书笔记',
            items: [
                {
                    text: '技术类笔记',
                    items: [
                        { text: 'Linux 内核设计与实现', link: '/ReadingNotes/Linux内核设计与实现/' },
                        { text: 'C++ Primer Plus (第6版) 中文版', link: '/ReadingNotes/C++_Primer_Plus/' },
                        { text: 'Computer Systems: A Programmer\'s Perspective', link: '/ReadingNotes/CSAPP/' },
                        { text: 'C++ 程序设计现代方法', link: '/ReadingNotes/cpp_modern_approach/' },
                        { text: '操作系统概念', link: '/ReadingNotes/操作系统概念/' },
                    ]
                },
                {
                    text: '文学类笔记',
                    items: [
                        { text: 'KindleNotes', link: '/KindleNotes/' },
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
                { text: 'NowCoder', link: '/XCPC/NowCoder/' },
                { text: '学习笔记', link: '/XCPC/Note/' },
                { text: '其他', link: '/XCPC/Other/' },
            ]
        },
        {
            text: '其他内容',
            items: [
                { text: 'C++后端开发面试题与知识点汇总', link: '/Other/Cpp_Interview_Summary' },
            ]
        }
    ];
}


function courses_notes_sidebar() {
    return [{
        text: 'CoursesNotes',
        items: [
            { text: 'CoursesNotes', link: '/CoursesNotes/' },
            { text: '计算机网络', link: '/CoursesNotes/计算机网络/第一章_计算机网络体系结构' },
            { text: '网络攻防技术', link: '/CoursesNotes/网络攻防技术/第4章_传输层安全协议TLS' },
            { text: '马克思主义基本原理', link: '/CoursesNotes/马克思主义基本原理/index.md' },
        ]
    }];
}

function av_develop_sidebar() {
    return [{
        text: '音视频开发',
        items: [
            { text: '音视频开发', link: '/AVDevelop/' },
            { text: '第一节：H264编码解码转码', link: '/AVDevelop/1-H264编码解码转码' },
        ]
    }];
}

function computer_network_sidebar() {
    return [{
        text: '计算机网络',
        items: [
            { text: '计算机网络', link: '/CoursesNotes/计算机网络/第一章_计算机网络体系结构' },
            { text: '第一章：计算机网络体系结构', link: '/CoursesNotes/计算机网络/第一章_计算机网络体系结构' },
            { text: '第五章：传输层', link: '/CoursesNotes/计算机网络/第五章_传输层' },
        ]
    }];
}

function operating_system_sidebar() {
    return [{
        text: '操作系统',
        items: [
            { text: '操作系统', link: '/CoursesNotes/操作系统/' },
            { text: '第一章：计算机系统概述', link: '/CoursesNotes/操作系统/1-计算机系统概述' },
        ]
    }];
}

function network_security_sidbar() {
    return [{
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
    }];
}

function reading_notes_sidebar() {
    return [{
        text: 'ReadingNotes',
        items: [
            { text: 'ReadingNotes', link: '/ReadingNotes/' },
            { text: 'Linux 内核设计与实现', link: '/ReadingNotes/Linux内核设计与实现/' },
            { text: 'C++ Primer Plus (第6版) 中文版', link: '/ReadingNotes/C++_Primer_Plus/' },
            { text: 'Computer Systems: A Programmer\'s Perspective', link: '/ReadingNotes/CSAPP/' },
            { text: 'C++ 程序设计现代方法', link: '/ReadingNotes/cpp_modern_approach/' },
            { text: '操作系统概念', link: '/ReadingNotes/操作系统概念/' },
        ]
    }];
}

function cpp_primer_plus_sidebar() {
    return [{
        text: 'C++ Primer Plus',
        items: [
            { text: 'C++ Primer Plus (第6版) 中文版', link: '/ReadingNotes/C++_Primer_Plus/' },
            { text: '第10章：对象与类', link: '/ReadingNotes/C++_Primer_Plus/第10章_对象与类' },
        ]
    }];
}


function linux_kernel_sidebar() {
    return [{
        text: 'Linux 内核设计与实现',
        items: [
            { text: 'Linux 内核设计与实现', link: '/ReadingNotes/Linux内核设计与实现/' },
            { text: '第一章：Linux 内核简介', link: '/ReadingNotes/Linux内核设计与实现/第一章_Linux内核简介' },
            { text: '第二章：从内核出发', link: '/ReadingNotes/Linux内核设计与实现/第二章_从内核出发' },
            { text: '第三章：进程管理', link: '/ReadingNotes/Linux内核设计与实现/第三章_进程管理' },
        ]
    }];
}

function csapp_sidebar() {
    return [{
        text: 'Computer Systems: A Programmer\'s Perspective',
        items: [
            { text: 'Computer Systems: A Programmer\'s Perspective', link: '/ReadingNotes/CSAPP/' },
            { text: '第1章：计算机系统漫游', link: '/ReadingNotes/CSAPP/1-computer-system-roaming' },
            { text: '第2章：信息的表示和处理', link: '/ReadingNotes/CSAPP/2-information-representation-and-processing' },
            { text: '第3章：程序的机器级表示', link: '/ReadingNotes/CSAPP/3-machine-level-representation-of-program' },
        ]
    }];
}

function cpp_modern_approach_sidebar() {
    return [{
        text: 'C++ 程序设计现代方法',
        items: [
            { text: 'C++ 程序设计现代方法', link: '/ReadingNotes/cpp_modern_approach/' },
            { text: '第七章：多态', link: '/ReadingNotes/cpp_modern_approach/7-polymorphism.md' },
        ]
    }];
}

function os_concept_sidebar() {
    return [{
        text: '操作系统概念',
        items: [
            { text: '操作系统概念', link: '/ReadingNotes/操作系统概念/' },
            { text: '第1章：导论', link: '/ReadingNotes/操作系统概念/第1章_引论' },
        ]
    }];
}

function atcoder_sidebar() {
    return [{
        text: 'Atcoder',
        items: [
            {
                text: 'Atcoder Beginner Contect',
                items: [
                    { text: 'ABC 182', link: '/XCPC/Atcoder/ABC182' },
                    { text: 'ABC 188', link: '/XCPC/Atcoder/ABC188' },
                    { text: 'ABC 189', link: '/XCPC/Atcoder/ABC189' },
                    { text: 'ABC 244', link: '/XCPC/Atcoder/ABC244' },
                    { text: 'ABC 245', link: '/XCPC/Atcoder/ABC245' },
                    { text: 'ABC 247', link: '/XCPC/Atcoder/ABC247' },
                    { text: 'ABC 250', link: '/XCPC/Atcoder/ABC250' },
                    { text: 'ABC 285', link: '/XCPC/Atcoder/ABC285' }
                ]
            },
            {
                text: 'Atcoder Regular Contect',
                items: [
                    { text: 'ARC 106', link: '/XCPC/Atcoder/ARC106' },
                    { text: 'ARC 116', link: '/XCPC/Atcoder/ARC116' },
                    { text: 'ARC 147', link: '/XCPC/Atcoder/ARC147' },
                    { text: 'ARC 148', link: '/XCPC/Atcoder/ARC148' }
                ]
            },
            {
                text: 'Other Atcoder Contest',
                items: [
                    { text: 'Education DP Contest', link: '/XCPC/Atcoder/EducationDPContest' },
                    { text: 'KEYENCE 2021', link: '/XCPC/Atcoder/keyence2021' }
                ]
            }
        ]
    }];
}

function codechef_sidebar() {
    return [{
        text: 'CodeChef',
        items: [
            { text: 'CodeChef', link: '/XCPC/CodeChef/' },
            { text: 'CodeChef Starters 39 Div4', link: '/XCPC/CodeChef/STARTER39' }
        ]
    }];
}

function codeforces_sidebar() {
    return [{
        text: 'Codeforces',
        items: [
            { text: 'Codeforces', link: '/XCPC/Codeforces/' },
            { text: 'Codeforces Round 684 (Div2)', link: '/XCPC/Codeforces/CF1440_R684' },
            { text: 'Codeforces Round 685 (Div2)', link: '/XCPC/Codeforces/CF1451_R685' },
            { text: 'Educational Codeforces Round 98', link: '/XCPC/Codeforces/CF1452_EDU98' },
            { text: 'Codeforces Round 691 (Div2)', link: '/XCPC/Codeforces/CF1459_R691' },
            { text: 'Codeforces Round 690 (Div3)', link: '/XCPC/Codeforces/CF1462_R690' },
            { text: 'Educational Codeforces Round 100', link: '/XCPC/Codeforces/CF1463_EDU100' },
            { text: 'Deltix Round, Autumn 2021', link: '/XCPC/Codeforces/CF1609-DR-Aut2021' },
            { text: 'Educational Codeforces Round 118', link: '/XCPC/Codeforces/CF1613-Edu118' },
            { text: 'Educational Codeforces Round 124', link: '/XCPC/Codeforces/CF1651-Edu124' },
            { text: 'Codeforces Round 779 (Div2)', link: '/XCPC/Codeforces/CF1658_R779' },
            { text: 'Codeforces Round 783 (Div2)', link: '/XCPC/Codeforces/CF1668_R783' },
            { text: 'Educational Codeforces Round 127', link: '/XCPC/Codeforces/CF1671_Edu127' },
            { text: 'Codeforces Round 787 (Div3)', link: '/XCPC/Codeforces/CF1675_R787' },
            { text: 'Codeforces Round 819 (Div1 + Div2)', link: '/XCPC/Codeforces/CF1726_R819' },
            { text: 'Educational Codeforces Round 135', link: '/XCPC/Codeforces/CF1728_Edu135' },
            { text: 'CodeTON Round 3 (Div1 + Div2)', link: '/XCPC/Codeforces/CF1750_TON3' },
            { text: 'Codeforces Round 854 by cybercats (Div1 + Div2)', link: '/XCPC/Codeforces/CF1799_R854' },
            { text: 'Educational Codeforces Round 144', link: '/XCPC/Codeforces/CF1796_Edu144' },
            { text: 'Codeforces Round 889 (Div1 + Div2)', link: '/XCPC/Codeforces/CF1855_R889' },
            { text: 'Codeforces Round 890 (Div. 2) supported by Constructor Institute', link: '/XCPC/Codeforces/CF1856_R890' },
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
            { text: '力扣杯2022春季编程挑战赛', link: '/XCPC/Leetcode/LeetCodeCup_2022Spring' },
            { text: '力扣双周赛 95', link: '/XCPC/Leetcode/LeetCodeBiWeeklyContest95' },
            { text: '力扣双周赛 97', link: '/XCPC/Leetcode/LeetCodeBiWeeklyContest97' },
            { text: '力扣周赛 291', link: '/XCPC/Leetcode/LeetCodeWeeklyContest291' },
            { text: '力扣周赛 292', link: '/XCPC/Leetcode/LeetCodeWeeklyContest292' },
            { text: '力扣周赛 331', link: '/XCPC/Leetcode/LeetCodeWeeklyContest331' },
        ]
    }]
}

function nowcoder_sidebar() {
    return [{
        text: 'Nowcoder',
        items: [
            { text: 'Nowcoder', link: '/XCPC/Nowcoder/' },
            { text: '牛客挑战赛', link: '/XCPC/Nowcoder/NCT066' },
        ]
    }]
}
function xcpc_note_sidebar() {
    return [{
        text: 'Note',
        items: [
            { text: '笔记', link: '/XCPC/Note/' },
            { text: 'QuickSort', link: '/XCPC/Note/Quicksort' },
            { text: 'SortAlgorithm', link: '/XCPC/Note/SortAlgorithm' }
        ]
    }]
}

function xcpc_other_sidebar() {
    return [{
        text: 'Other',
        items: [
            { text: '其他内容', link: '/XCPC/Other/' },
            { text: 'UESTCPC2022', link: '/XCPC/Other/UESTCPC2022' },
        ]
    }]
}

function others_sidebar() {
    return [{
        text: '其他内容',
        items: [
            { text: 'C++后端开发面试题与知识点汇总', link: '/Other/Cpp_Interview_Summary' },
        ]
    }];
}

// AUTO-GENERATED-CONTENT:START
function kindle_note_sidebar() {
    return [{
        text: 'KindleNotes',
        items: [
            { text: 'KindleNotes', link: '/kindlenotes/' },
            { text: '动物农场', link: '/KindleNotes/动物农场' },
            { text: '易中天中华史：王安石变法', link: '/KindleNotes/易中天中华史：王安石变法' },
            { text: '杀死一只知更鸟', link: '/KindleNotes/杀死一只知更鸟' },
            { text: '欢迎来到实力至上主义的教室 08', link: '/KindleNotes/欢迎来到实力至上主义的教室 08' },
            { text: '欢迎来到实力至上主义的教室 09', link: '/KindleNotes/欢迎来到实力至上主义的教室 09' },
            { text: '欢迎来到实力至上主义的教室 10', link: '/KindleNotes/欢迎来到实力至上主义的教室 10' },
            { text: '欢迎来到实力至上主义的教室 11', link: '/KindleNotes/欢迎来到实力至上主义的教室 11' },
            { text: '欢迎来到实力至上主义的教室二年级篇 01', link: '/KindleNotes/欢迎来到实力至上主义的教室二年级篇 01' },
            { text: '海伯利安', link: '/KindleNotes/海伯利安' },
            { text: '海伯利安的陨落', link: '/KindleNotes/海伯利安的陨落' },
        ]
    }]
}
// AUTO-GENERATED-CONTENT:END