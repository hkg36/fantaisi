#coding:utf-8
import web
import WebSiteBasePage
import database
from data.Party import Party
from tools.data import AutoClose
from sqlalchemy.orm import defer

class OfflineActionList(WebSiteBasePage.AutoPage):
    def GET(self):
        session=database.Session()
        with AutoClose(session) as ac:
            parties=session.query(Party).options(defer(Party.guest),defer(Party.content)).all()
            tpl=WebSiteBasePage.jinja2_env.get_template('OfflineActionList.html')
            return tpl.render(parties=parties)
