$dir = "c:\Users\nilga\Downloads\SIto LMS\sitolms\chi-siamo\images-team"

# Remove all existing files
Remove-Item "$dir\*" -Force

# Copy fresh from source and rename
$src = "c:\Users\nilga\Downloads\SIto LMS\Chi Siamo\images team"
Get-ChildItem $src -Filter "*.png" | ForEach-Object {
    $newName = $_.Name -replace ' ', '-' -replace '\(', '' -replace '\)', ''
    Copy-Item $_.FullName -Destination (Join-Path $dir $newName) -Force
}

Write-Output "Files in images-team:"
Get-ChildItem $dir | Select-Object Name
Write-Output "Total: $((Get-ChildItem $dir).Count) files"
