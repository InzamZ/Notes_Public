import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3';

const customElements = ['mjx-container'];

export default defineConfig({
    lang: 'zh-CN',
    lastUpdated: true,
    markdown: {
        config: (md) => {
            // use more markdown-it plugins!
            md.use(require('markdown-it-task-lists'))
            md.use(mathjax3)
            // md.use(require('markdown-it-pdf'), {
            //     showUrl: true
            // });
        }
    },
    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => customElements.includes(tag),
            },
        },
    },
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
            { text: 'ABC182', link: '/XCPC/Atcoder/ABC182' },
            { text: 'ABC188', link: '/XCPC/Atcoder/ABC188' },
            { text: 'ABC189', link: '/XCPC/Atcoder/ABC189' },
            { text: 'ABC244', link: '/XCPC/Atcoder/ABC244' },
            { text: 'ABC245', link: '/XCPC/Atcoder/ABC245' },
            { text: 'ABC247', link: '/XCPC/Atcoder/ABC247' },
            { text: 'ABC250', link: '/XCPC/Atcoder/ABC250' },
            { text: 'ARC106', link: '/XCPC/Atcoder/ARC106' },
            { text: 'ARC116', link: '/XCPC/Atcoder/ARC116' },
            { text: 'ARC147', link: '/XCPC/Atcoder/ARC147' },
            { text: 'ARC148', link: '/XCPC/Atcoder/ARC148' },
            { text: 'EducationDPContest', link: '/XCPC/Atcoder/EducationDPContest' },
            { text: 'keyence2021', link: '/XCPC/Atcoder/keyence2021' }
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
            { text: 'CF1440_R684', link: '/XCPC/Codeforces/CF1440_R684' },
            { text: 'CF1451_R685', link: '/XCPC/Codeforces/CF1451_R685' },
            { text: 'CF1452_EDU98', link: '/XCPC/Codeforces/CF1452_EDU98' },
            { text: 'CF1459_R691', link: '/XCPC/Codeforces/CF1459_R691' },
            { text: 'CF1462_R690', link: '/XCPC/Codeforces/CF1462_R690' },
            { text: 'CF1463_EDU100', link: '/XCPC/Codeforces/CF1463_EDU100' },
            { text: 'CF1609-DR-Aut2021', link: '/XCPC/Codeforces/CF1609-DR-Aut2021' },
            { text: 'CF1613-Edu118', link: '/XCPC/Codeforces/CF1613-Edu118' },
            { text: 'CF1651-Edu124', link: '/XCPC/Codeforces/CF1651-Edu124' },
            { text: 'CF1658_R779', link: '/XCPC/Codeforces/CF1658_R779' },
            { text: 'CF1668_R783', link: '/XCPC/Codeforces/CF1668_R783' },
            { text: 'CF1671_Edu127', link: '/XCPC/Codeforces/CF1671_Edu127' },
            { text: 'CF1675_R787', link: '/XCPC/Codeforces/CF1675_R787' },
            { text: 'CF1726_R819', link: '/XCPC/Codeforces/CF1726_R819' },
            { text: 'CF1728_Edu135', link: '/XCPC/Codeforces/CF1728_Edu135' },
            { text: 'CF1750_TON3', link: '/XCPC/Codeforces/CF1750_TON3' }
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