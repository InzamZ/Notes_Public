export default {
    lang: 'zh-CN',
    lastUpdated: true,
    markdown: {
        config: (md) => {
            // use more markdown-it plugins!
            md.use(require('markdown-it-task-lists'))
            // md.use(require('markdown-it-pdf'), {
            //     showUrl: true
            // });
        }
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
                text: '文学类笔记',
            }
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
            '/Other': [{
                text: '其他内容',
                items: [
                    { text: 'C++后端开发面试题与知识点汇总', link: '/Other/Cpp_Interview_Summary' },
                ]
            }],
        }
    }

}