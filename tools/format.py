#coding:utf8
import re
from StringIO import StringIO

def ContentFormat(str):
    gds=re.finditer("(\[(?P<token>\w+)\](?P<cnt>.*?)\[/(?P=token)]|(?P<txt>.*?)\r?(\n|$))",str,re.S)
    resstr=StringIO()
    for one in gds:
        token=one.group("token")
        if token==None:
            txt=one.group("txt")
            txt=txt.strip()
            if len(txt)>0:
                resstr.write("<p>%s</p>\n"%txt)
        else:
            cnt=one.group("cnt")
            if token=="qt":
                pair=cnt.split("[by]")
                resstr.write("""<blockquote class="simple">
                                <div class="quote-content">
                                    <p>%s</p>
                                </div>
                                <div class="quote-meta">&mdash; %s</div>
                            </blockquote>"""%(pair[0],pair[1]))
            elif token=="ls":
                pair=cnt.split("[sp]")
                resstr.write("<ol class=\"decimal indent\">")
                for one in pair:
                    resstr.write("<li>%s</li>"%one)
                resstr.write("</ol>")
            elif token=="h":
                resstr.write("<h4>%s</h4>\n"%cnt)
            elif token=="img":
                resstr.write("<div class=\"imgline\"><img src=\"%s\"></div>"%cnt)
    return resstr.getvalue()

if __name__ == '__main__':
    print ContentFormat("关于产品，京东IT数码事业部品牌合作与发展部总经理汪延领认为，很多产品都会有舍本逐末的毛病，产品最终还是要围绕客户需求。联想之星执行董事王明耀认为，智能硬件应该跟日常生活结合，包括但不限于智能家居、可穿戴设备、智能汽车上面。英特尔在线业务部总经理王稚聪更期待中国新一代年轻的工程师，能够提供无人机、智能玩具等更多可玩的东西。")