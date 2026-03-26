$w = New-Object -ComObject Word.Application
$w.Visible = $false
$d = $w.Documents.Open("c:\Users\nilga\Desktop\Import\SIto LMS\Talent\Talent.docx")
$t = $d.Content.Text
$d.Close($false)
$w.Quit()
Set-Content -Path "c:\Users\nilga\Desktop\Import\SIto LMS\Talent\copy_output.txt" -Value $t -Encoding UTF8
