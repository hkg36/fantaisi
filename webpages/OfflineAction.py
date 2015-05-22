#coding:utf-8
import web
import WebSiteBasePage
import database
from data.Party import Party
from data.join import JoinParty
from tools.data import AutoClose
import tools.format
import json

class OfflineAction(WebSiteBasePage.AutoPage):
    def GET(self):
        user_data = web.input()
        session=database.Session()
        with AutoClose(session) as ac:
            party=session.query(Party).filter(Party.id==user_data.id).one()
            content=tools.format.ContentFormat(party.content)
            guests=json.loads(party.guest)
            tpl=WebSiteBasePage.jinja2_env.get_template('OfflineAction.html')
            return tpl.render(party=party,content=content,guests=guests)

class OfflineActionReg(WebSiteBasePage.AutoPage):
    def POST(self):
        user_data = web.input()
        session=database.Session()
        with AutoClose(session) as ac:
            onejoin=JoinParty()
            onejoin.partyId=user_data.partyid
            onejoin.name=user_data.name
            onejoin.email=user_data.email
            onejoin.phone=user_data.phone
            session.merge(onejoin)
            session.commit()
        return "ok"