#coding:utf-8
import web

from WebSiteBasePage import LoadPageList
import tools.data

web.config.debug = False
path_list=LoadPageList()
webapp=web.application(path_list, locals())
tools.data.session = web.session.Session(webapp, tools.data.MemCacheStore())
del path_list
application = webapp.wsgifunc()
