@echo off
rem Openclaw Gateway (v0.1.7)
set PATH=C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32\OpenSSH\;D:\;C:\Git\cmd;C:\Users\26608\AppData\Local\Microsoft\WindowsApps;D:\PyCharm 2025.2.4\bin;C:\Users\26608\AppData\Local\Python\bin;C:\Users\26608\AppData\Local\Python\Python314\Scripts;C:\Users\26608\AppData\Roaming\npm
set OPENCLAW_GATEWAY_PORT=18789
set OPENCLAW_GATEWAY_TOKEN=undefined
set OPENCLAW_SYSTEMD_UNIT=openclaw-gateway.service
set OPENCLAW_SERVICE_MARKER=openclaw
set OPENCLAW_SERVICE_KIND=gateway
set OPENCLAW_SERVICE_VERSION=0.1.7
D:\node.exe C:\Users\26608\AppData\Roaming\npm\node_modules\openclaw-cn\dist\entry.js gateway --port 18789
