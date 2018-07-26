#!/bin/bash
npm start --prefix /home/pi/kiosk/server & (sleep 5 && chromium-browser --noerrdialogs --kiosk http://127.0.0.1:3000/config --incognito)
