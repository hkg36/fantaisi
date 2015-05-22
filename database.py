from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

db=create_engine("mysql://root:fantaisi2015@127.0.0.1:3306/fantasy?charset=utf8",pool_recycle=60)
DBBase=declarative_base(name="DBBase")
Session = sessionmaker(bind=db,autocommit=False,autoflush=False)
