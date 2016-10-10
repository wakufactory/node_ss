#!/bin/bash
f=$0
d=${f%/*}
cd "$d"
node main.js &
sleep 1
open http://localhost:8080/index.html
read wait
