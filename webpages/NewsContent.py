#coding:utf-8
import web
import WebSiteBasePage
import database
from data.news import News
from tools.data import AutoClose
import tools.format
from  sqlalchemy import func

class NewsContent(WebSiteBasePage.AutoPage):
    def GET(self):
        user_data = web.input()
        session=database.Session()
        with AutoClose(session) as ac:
            news=session.query(News).filter(News.id==user_data.id).one()
            content=tools.format.ContentFormat(news.content)
            relatenews=session.query(News.id,News.title).filter(News.id!=user_data.id).order_by(func.random()).limit(3)
            tpl=WebSiteBasePage.jinja2_env.get_template('NewsContent.html')
            return tpl.render(news=news,content=content,relate=relatenews)