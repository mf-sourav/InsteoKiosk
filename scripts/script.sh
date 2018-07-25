#!/bin/bash
npm start --prefix /home/pi/kiosk/ & (sleep 5 && chromium-browser --noerrdialogs --kiosk http://127.0.0.1:3000/config --incognito)
# npm start --prefix /home/pi/kiosk/ & (sleep 5 && chromium-browser --no-sandbox --noerrdialogs --kiosk http://127.0.0.1:3000/config --incognito)
# node /home/pi/kiosk/server.js & chromium-browser --noerrdialogs --kiosk http://127.0.0.1:3000/config
# node /var/www/html/others/insteo/main.js & google-chrome --noerrdialogs --kiosk http://localhost:8989/config
