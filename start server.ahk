#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.


; Ctrl-1. cds into frontend, runs frontend 
^1::
SendInput, cd PATH_TO_FRONTEND{Enter}
sleep, 100  ; waits 0.1s 
SendInput, npm start
return

; Ctrl-2. cds into backend, runs backend server. 
^2::
SendInput, cd PATH_TO_BACKEND{Enter}
sleep, 100
SendInput, Set-ExecutionPolicy Unrestricted -Scope Process{Enter}
sleep, 100
SendInput, y{Enter}
sleep, 100
SendInput, .\windowsVenv\Scripts\activate{Enter}
sleep, 100
SendInput, py server.py{Enter}
return




