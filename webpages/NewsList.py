#coding:utf-8
import web
import WebSiteBasePage
import database
from data.news import News
from tools.data import AutoClose
from sqlalchemy.orm import defer

class NewsList(WebSiteBasePage.AutoPage):
    def GET(self):
        session=database.Session()
        with AutoClose(session) as ac:
            all=session.query(News).options(defer('content')).order_by(News.id.desc()).all()
            tpl=WebSiteBasePage.jinja2_env.get_template('NewsList.html')
            return tpl.render(news=all)
