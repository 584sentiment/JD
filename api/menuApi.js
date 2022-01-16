//数据结构
/* {
    data: [
        {
            titles: [
                {
                    name:'体是和队',
                    href:'#'
                },
                {
                    name:'sadf',
                    href:'#'
                },
                //...
            ],
            content:{
                tabs:[
                    {
                        name:'体是和队',
                        href:'#'
                    },
                    {
                        name:'sadf',
                        href:'#'
                    },
                    //...
                ],
                details:[
                    {
                        category:'电视',
                        items:[
                            {
                                name:'体是和队',
                                href:'#'
                            },
                            //...
                        ]
                    }
                ]
            }
        },
       // ...
    ]
} */

Mock.mock('/menu',{
    'data|18':[{    //所有数据列表 
        'titles|2-3':[{  //左边的分类
            name:'@cword(2,4)', //分类名称
            href:'@url(http)'   //分类链接
        }],
        content:{   //右边对应的子分类
            'tabs|2-5':[{   //子分类上面的tab
                name:'@cword(2,4)',
                href:'@url(http)'
            }],
            'details|8-15':[{   //子分类下面的详情
                category:{
                    name:'@cword(2,4)',
                    href:'@url(http)'
                }, //详情左边的名称
                'items|8-16':[{ //详细右边的分类
                    name:'@cword(2,4)',
                    href:'@url(http)'
                }]
            }]
        }
    }]
})