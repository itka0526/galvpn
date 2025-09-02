#!/bin/bash

# Add to crontab
# crontab -e
# @reboot /root/start_project.sh >> /root/log.txt 2>&1

echo "==== Starting at $(date) ====" >> /root/log.txt 2>&1

cd ./backend/ || exit 1

/usr/bin/npm run build >> /root/log.txt 2>&1

/usr/bin/npm run start >> /root/log.txt 2>&1
