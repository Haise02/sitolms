Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("c:\Users\nilga\Desktop\Import\SIto LMS\Talent\Talent.docx")
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = [xml]$reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$paragraphs = $xml.SelectNodes("//w:p", $ns)
$lines = @()
foreach ($p in $paragraphs) {
    $texts = $p.SelectNodes(".//w:t", $ns)
    $line = ""
    foreach ($t in $texts) {
        $line += $t.InnerText
    }
    if ($line.Trim() -ne "") {
        $lines += $line
    }
}
$lines -join "`r`n" | Set-Content -Path "c:\Users\nilga\Desktop\Import\SIto LMS\Talent\copy_output.txt" -Encoding UTF8
