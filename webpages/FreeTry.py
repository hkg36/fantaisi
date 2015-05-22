#coding:utf-8
import web
import WebSiteBasePage
import database
from data.fresh import Fresh
from data.join import JoinFresh
from tools.data import AutoClose
from sqlalchemy.orm import defer

class FreeTry(WebSiteBasePage.AutoPage):
    def GET(self):
        session=database.Session()
        with AutoClose(session) as ac:
            one=session.query(Fresh).filter(Fresh.display==2).one()
            tpl=WebSiteBasePage.jinja2_env.get_template('FreeTry.html')
            return tpl.render(one=one)

class FreeTryReg(WebSiteBasePage.AutoPage):
    def POST(self):
        user_data = web.input()
        session=database.Session()
        with AutoClose(session) as ac:
            onejoin=JoinFresh()
            onejoin.name=user_data.name
            onejoin.email=user_data.email
            onejoin.phone=user_data.phone
            onejoin.message=user_data.message
            session.merge(onejoin)
            session.commit()
        return "ok"