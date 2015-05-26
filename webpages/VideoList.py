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

youku_id='7ef06e647b67fa1b'
playlist_id=21581216
class VideoList2(WebSiteBasePage.AutoPage):
    def GET(self):
        tpl=WebSiteBasePage.jinja2_env.get_template('VideoList2.html')
        return tpl.render(youku_id=youku_id,playlist_id=playlist_id)

class VideoDetail(WebSiteBasePage.AutoPage):
    def GET(self):
        user_data = web.input()
        tpl=WebSiteBasePage.jinja2_env.get_template('VideoDetail.html')
        return tpl.render(youku_id=youku_id,video_id=user_data.video_id)