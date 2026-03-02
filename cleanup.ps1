$dir = "c:\Users\nilga\Downloads\SIto LMS\sitolms\chi-siamo\images-team"

# Remove old files with spaces/parentheses (keep only renamed ones and numbered ones)
Get-ChildItem $dir -Filter "Salvatore Scibetta*" | Remove-Item -Force

# Now re-copy and rename properly
$src = "c:\Users\nilga\Downloads\SIto LMS\Chi Siamo\images team"
Get-ChildItem $src -Filter "*.png" | ForEach-Object {
    $newName = $_.Name -replace ' ', '-' -replace '\(', '' -replace '\)', ''
    Copy-Item $_.FullName -Destination (Join-Path $dir $newName) -Force
}

Write-Output "Files in images-team:"
Get-ChildItem $dir | Select-Object Name
Write-Output "Total: $((Get-ChildItem $dir).Count) files"
