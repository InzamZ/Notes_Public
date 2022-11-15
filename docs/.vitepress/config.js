export default {
    themeConfig: {
        logo: '/my-logo.svg',
        nav: [
            { text: 'CoursesNotes', link: '/CoursesNotes' },
            { text: 'ReadingNotes', link: '/ReadingNotes' },
        ]，
        sidebar: {
            '/CoursesNotes/':[
                {
                    text: 'CoursesNotes',
                    items: [
                        { text: 'Index', link: '/CoursesNotes/' },
                        { text: '计算机网络', link: '/CoursesNotes/计算机网络/第一章_计算机网络' },
                        { text: '网络攻防技术', link: '/CoursesNotes/网络攻防技术/第4章_传输层安全协议TLS'},
                    ]  
                }
            ],
            '/ReadingNotes/': [
                {
                    text: 'ReadingNotes',
                    items: [
                        { text: 'Index', link: '/ReadingNotes/' },
                        { text: 'Linux内核设计与实现', link: '/ReadingNotes/Linux内核设计与实现' },
                    ]
                }
            ] 
        }
    }

}