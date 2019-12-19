#!/bin/bash
util=`uptime | awk '{print $10}' | awk -F ',' '{print $1}'`
directory="/home/ec2-user/logs/"
# 对应到 CPU 的总核数，比如 c4.4xlarge 就是 16 Core
maxusage=3.5
dt=`date "+%Y-%m-%d-%H:%M:%S"`
if [[ `expr $util \> $maxusage` -eq 1 ]] ; then
 uptime > ${directory}${dt}"cpuload.txt"
 top -b -n 1 > ${directory}${dt}"processinfo.txt"
 netstat -anpt > ${directory}${dt}"networkinfo.txt"
fi
