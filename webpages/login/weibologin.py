#coding:utf-8
import web
import WebSiteBasePage
from data.login import User
import database
from tools.data import AutoClose
import tools.data
import datetime
import sina_province_code

class WBUserInfo(WebSiteBasePage.AutoPage):
    def POST(self):
        params=web.input()
        sina_province_code.PrepareCodeList()
        session=database.Session()
        with AutoClose(session) as ac:
            usr=session.query(User).filter(User.weibo_id==params.idstr).first()
            if not usr:
                usr=User()
                usr.weibo_id=params.idstr
            usr.weibo_accessToken=params.accessToken
            usr.nickname=params.screen_name
            usr.image=params.profile_image_url
            usr.big_image=params.avatar_large
            if params.gender=="m":
                usr.gender="男"
            elif params.gender=="f":
                usr.gender="女"
            else:
                usr.gender="未知"
            try:
                usr.province=sina_province_code.provs.get(int(params.province))
                usr.city=sina_province_code.citys.get((int(params.province),int(params.city)))
            except:
                pass
            usr.last_login=datetime.datetime.now()
            usr=session.merge(usr)
            session.commit()

            web.setcookie("uid",usr.id)
            web.setcookie("qqopenid","")
            web.setcookie("wbuid",usr.weibo_id)

            return ""

class WBLogout(WebSiteBasePage.AutoPage):
    def POST(self):
        web.setcookie("uid",0)
        web.setcookie("qqopenid","")
        web.setcookie("wbuid","")