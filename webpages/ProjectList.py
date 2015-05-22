#coding:utf-8
import web
import WebSiteBasePage
import database
from data.project import Project
from tools.data import AutoClose
from sqlalchemy.orm import defer

class ProjectList(WebSiteBasePage.AutoPage):
    def GET(self):
        session=database.Session()
        with AutoClose(session) as ac:
            projs=session.query(Project).options(defer("content")).all()
            tpl=WebSiteBasePage.jinja2_env.get_template('ProjectList.html')
            return tpl.render(projs=projs)
