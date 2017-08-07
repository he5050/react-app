import KoaRouter from "koa-router";
import procHandle from "./common";

// 首页
const homeRouter = new KoaRouter()
homeRouter.get(
  '(|/login/*|/register/*)',
  procHandle(
    {
      // 标题
      title: '首页',
      // 客户端渲染依赖的js文件名
      templateName: 'index',
    },
    require('../../app/pages/index/router.jsx').default,
  )
)

export default homeRouter
