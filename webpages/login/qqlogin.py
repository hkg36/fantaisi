#coding:utf-8
import web
import WebSiteBasePage
from data.login import User
import database
from tools.data import AutoClose
import tools.data
import datetime

class QQLogin(WebSiteBasePage.AutoPage):
    def GET(self):
        web.setcookie("uid",0)
        web.setcookie("qqopenid","")
        web.setcookie("wbuid","")
        tpl=WebSiteBasePage.jinja2_env.get_template('login/QQLogin.html')
        return tpl.render()

class QQUserInfo(WebSiteBasePage.AutoPage):
    def POST(self):
        params=web.input()
        session=database.Session()
        with AutoClose(session) as ac:
            usr=session.query(User).filter(User.qq_openid==params.openId).first()
            if not usr:
                usr=User()
                usr.qq_openid=params.openId
            usr.qq_accessToken=params.accessToken
            usr.nickname=params.nickname
            usr.image=params.figureurl
            usr.big_image=params.figureurl_2
            try:
                usr.year=int(params.year)
            except Exception,e:
                pass
            usr.gender=params.gender
            usr.province=params.province
            usr.city=params.city
            usr.last_login=datetime.datetime.now()
            usr=session.merge(usr)
            session.commit()
            tools.data.session.uid=usr.id
            tools.data.session.qq_openid=usr.qq_openid
            web.setcookie("uid",usr.id)
            web.setcookie("qqopenid",usr.qq_openid)
        return ""