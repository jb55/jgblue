#!/bin/bash
JGBLUEDIR=/home/jb55/jgblue
BACKUP=/home/jb55/backup
SQLDIR=$JGBLUEDIR/sql
LOGDIR=/home/jb55/jgblue/logs

$SQLDIR/dump-db-data jgblue > $BACKUP/sql/jgblue.sql
rsync -a $LOGDIR/ $BACKUP/logs/

