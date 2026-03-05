$w = New-Object -ComObject Word.Application
$w.Visible = $false
$d = $w.Documents.Open("c:\Users\nilga\Downloads\SIto LMS\Chi Siamo\copy chi siamo.docx")
$t = $d.Content.Text
$d.Close()
$w.Quit()
$t | Out-File -FilePath "c:\Users\nilga\Downloads\SIto LMS\Chi Siamo\copy_output.txt" -Encoding UTF8
Write-Output "DONE"
