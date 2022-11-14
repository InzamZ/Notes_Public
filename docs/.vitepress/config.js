export default {
    themeConfig: {
        logo: '/my-logo.svg',
        siteTitle: false,
        sidebar: {
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