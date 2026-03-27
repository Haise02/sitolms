function Extract-Docx($docxPath, $outPath) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = [xml]$reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $zip.Dispose()
    $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $ns.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
    $paragraphs = $xml.SelectNodes('//w:p', $ns)
    $lines = @()
    foreach($p in $paragraphs) {
        $texts = $p.SelectNodes('.//w:t', $ns)
        $line = ''
        foreach($t in $texts) { $line += $t.InnerText }
        if($line.Trim()) { $lines += $line }
    }
    $lines -join "`n" | Out-File -Encoding utf8 $outPath
    Write-Host "Extracted: $outPath"
}

$base = 'c:\Users\nilga\Desktop\Import\SIto LMS'
Extract-Docx "$base\Podcast\podcast.docx" "$base\Podcast\copy_output.txt"
Extract-Docx "$base\app lms\app lms.docx" "$base\app lms\copy_output.txt"
Extract-Docx "$base\corsti gratis\corsi.docx" "$base\corsti gratis\copy_output.txt"
