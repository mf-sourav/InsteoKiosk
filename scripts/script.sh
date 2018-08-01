#!/bin/bash
#when clicked on kiosk icon on desktop this script gets executed
#starts node js server & launches chromium browser after 5 secs
npm start --prefix /home/pi/kiosk/ & (sleep 5 && chromium-browser --noerrdialogs --kiosk http://127.0.0.1:3000/config --incognito)
