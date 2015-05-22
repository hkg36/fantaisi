#coding:utf-8
import web
import WebSiteBasePage
import database
from data.project import Project
from tools.data import AutoClose
import tools.format

class ProjectDetail(WebSiteBasePage.AutoPage):
    def GET(self):
        user_data = web.input()
        session=database.Session()
        with AutoClose(session) as ac:
            proj=session.query(Project).filter(Project.id==user_data.id).one()
            content=tools.format.ContentFormat(proj.content)
            pics=proj.image.split(',')
            tpl=WebSiteBasePage.jinja2_env.get_template('ProjectDetail.html')
            return tpl.render(proj=proj,content=content,pics=pics)
