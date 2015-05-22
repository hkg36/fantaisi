#coding:utf-8
import web
import WebSiteBasePage
import database
from data.video import Video
from tools.data import AutoClose
from sqlalchemy.orm import defer

class VideoList(WebSiteBasePage.AutoPage):
    def GET(self):
        session=database.Session()
        with AutoClose(session) as ac:
            videos=session.query(Video).all()
            tpl=WebSiteBasePage.jinja2_env.get_template('VideoList.html')
            return tpl.render(videos=videos)