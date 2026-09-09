$encoding = [System.Text.Encoding]::GetEncoding(949)
$content = [System.IO.File]::ReadAllText("src\app\shop\[id]\page.tsx", $encoding)
[System.IO.File]::WriteAllText("src\app\shop\[id]\page.tsx", $content, [System.Text.Encoding]::UTF8)
