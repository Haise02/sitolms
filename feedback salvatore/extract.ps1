$html = Get-Content 'c:\Users\nilga\Desktop\Import\SIto LMS\feedback salvatore\CopiadiFeedbackSitoLMS30Marzo2026.html' -Raw
$html = $html -replace '<img[^>]*>', '[IMG]'
$html = $html -replace '<br[^>]*>', "`n"
$html = $html -replace '</p>', "`n"
$html = $html -replace '</div>', "`n"
$html = $html -replace '<[^>]+>', ''
$html = [System.Net.WebUtility]::HtmlDecode($html)
$lines = $html -split "`n" | Where-Object { $_.Trim() -ne '' }
$lines -join "`n" | Out-File 'c:\Users\nilga\Desktop\Import\SIto LMS\feedback salvatore\feedback_text.txt' -Encoding UTF8
