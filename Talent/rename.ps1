$dir = "c:\Users\nilga\Downloads\SIto LMS\sitolms\chi-siamo\images-team"
Get-ChildItem $dir | ForEach-Object {
    $newName = $_.Name -replace ' ', '-' -replace '\(', '' -replace '\)', ''
    if ($newName -ne $_.Name) {
        Rename-Item $_.FullName -NewName $newName
    }
}
Get-ChildItem $dir | Select-Object Name
