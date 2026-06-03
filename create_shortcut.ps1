
# 创建 AutoGen Studio 桌面快捷方式
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\AutoGen Studio.lnk")
$Shortcut.TargetPath = "C:\Users\26608\.openclaw\Launch-AutoGen.bat"
$Shortcut.WorkingDirectory = "C:\Users\26608\.openclaw"
$Shortcut.Description = "AutoGen Studio - Multi-Agent AI Development"
# 使用系统自带的机器人图标
$Shortcut.IconLocation = "C:\Windows\System32\shell32.dll,165"
$Shortcut.Save()

Write-Host "桌面快捷方式已创建成功！" -ForegroundColor Green
Write-Host "路径: $DesktopPath\AutoGen Studio.lnk" -ForegroundColor Cyan
Write-Host ""
Write-Host "你现在可以双击桌面上的 'AutoGen Studio' 图标启动程序了！" -ForegroundColor Yellow

