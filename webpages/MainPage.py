#coding:utf-8
import web
import WebSiteBasePage
import database
from data.news import News
from data.project import Project
from data.partner import Partner
from tools.data import AutoClose
from sqlalchemy.orm import defer
from sqlalchemy import func

class MainPage(WebSiteBasePage.AutoPage):
    def GET(self):
        session=database.Session()
        with AutoClose(session) as ac:
            allnews=session.query(News).options(defer(News.content),defer(News.image)).order_by(News.id.desc()).limit(6).all()
            project=session.query(Project).options(defer(Project.content)).order_by(func.random()).first()
            partners=session.query(Partner).all()
            tpl=WebSiteBasePage.jinja2_env.get_template('Index.html')
            return tpl.render(news=allnews,project=project,partners=partners)