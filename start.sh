#!/bin/bash

# Uruchom D-Bus
dbus-daemon --system --fork

# Uruchom Xvfb
Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &

# Ustaw wyświetlacz
export DISPLAY=:99

# Poczekaj na uruchomienie Xvfb
sleep 1

# Uruchom aplikację
exec node server.js 