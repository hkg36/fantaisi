#coding:utf-8
import web
import WebSiteBasePage
from data.comment import VideoComment
from data.login import User
import database
from tools.data import AutoClose
import tools.data
import datetime
import json
from tools.json_tools import DefJsonEncoder

class VideoCommentList(WebSiteBasePage.AutoPage):
    def GET(self):
        param=web.input()
        session=database.Session()
        with AutoClose(session) as ac:
            all=session.query(VideoComment,User).join(User,VideoComment.uid==User.id).filter(VideoComment.youku_id==param.video_id).order_by(VideoComment.id.desc()).all()
            ret_data={}
            comlist=[]
            ret_data["comments"]=comlist
            for com,usr in all:
                data={
                    "user":usr.toJSON(),
                    "text":com.text,
                    "time":com.time
                }
                comlist.append(data)
            return DefJsonEncoder.encode(ret_data)

class AddVideoComment(WebSiteBasePage.AutoPage):
    def POST(self):
        param=web.input()
        session=database.Session()
        with AutoClose(session) as ac:
            vc=VideoComment()
            vc.uid=tools.data.session.uid
            vc.text=param.text
            vc.youku_id=param.video_id
            usr=session.query(User).filter(User.id==tools.data.session.uid).one()
            vc=session.merge(vc)
            session.commit()
            data={
                "user":usr.toJSON(),
                "text":vc.text,
                "time":vc.time
            }
            return DefJsonEncoder.encode(data)

