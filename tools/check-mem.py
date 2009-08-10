#!/usr/bin/env python
from popen2 import popen2 as popen

PERCENT_LIMIT = 5

def send_email(mem, total_mem, percent):
    import smtplib
    to = "jb55+alert@jgblue.com"
    frm = "garfist@jgblue.com"
    subject = "Garfist memory low"
    msg = """Subject: Garfist memory low

    Status --
    %d / %d (%f%%)
    """ % (mem, total_mem, percent)
    
    server = smtplib.SMTP('localhost')
    server.sendmail(frm, to, msg)
    server.quit

total_mem = int(popen("free | grep Mem: | awk '{ print $2 }'")[0].read().strip())
mem = int(popen("free | grep buffers/cache | awk '{ print $4; }'")[0].read().strip())

percent = (float(mem) / float(total_mem))*100

print mem, "/", total_mem, percent

if percent <= PERCENT_LIMIT:
    send_email(mem, total_mem, percent)

