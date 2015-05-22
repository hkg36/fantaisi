#coding:utf-8
import web
import WebSiteBasePage
import database
from data.news import News
from tools.data import AutoClose
from StringIO import StringIO

class testpage(WebSiteBasePage.AutoPage):
    def GET(self):
        web.header('Content-Type','text/html; charset=utf-8', unique=True)
        session=database.Session()
        str=StringIO("test")
        with AutoClose(session) as ac:
            all=session.query(News).all()
            for one in all:
                str.write(one.title)
                str.write(' ')
        return str.getvalue()