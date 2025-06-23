# PowerShell script to remove comments from JavaScript/TypeScript files

function Remove-Comments {
    param (
        [string]$FilePath
    )
    
    $content = Get-Content -Path $FilePath -Raw
    
    # Remove single-line comments (// ...) but preserve URLs and file paths
    $content = $content -replace '(?<!:)//(?!\s*\w+:)[^\r\n]*', ''
    
    # Remove multi-line comments (/* ... */) but preserve JSDoc
    $content = $content -replace '/\*(?!\*)[^*]*\*+(?:[^/*][^*]*\*+)*/', ''
    
    # Remove JSX comments {/* ... */}
    $content = $content -replace '\{\s*/\*[^*]*\*+(?:[^/*][^*]*\*+)*/\s*\}', ''
    
    # Clean up multiple blank lines
    $content = $content -replace '\r?\n\s*\r?\n\s*\r?\n', "`n`n"
    
    # Remove trailing whitespace from lines
    $content = $content -replace '\s+$', ''
    
    Set-Content -Path $FilePath -Value $content -NoNewline
    Write-Host "Processed: $FilePath"
}

# Get all JavaScript/TypeScript files in frontend and backend
$frontendFiles = Get-ChildItem -Recurse -Path "frontend\src" -Include "*.tsx","*.ts","*.js","*.jsx" | Where-Object { $_.Name -notlike "*.d.ts" }
$backendFiles = Get-ChildItem -Recurse -Path "backend" -Include "*.js" | Where-Object { $_.Name -ne "package.json" }

Write-Host "Removing comments from frontend files..."
foreach ($file in $frontendFiles) {
    Remove-Comments -FilePath $file.FullName
}

Write-Host "Removing comments from backend files..."
foreach ($file in $backendFiles) {
    Remove-Comments -FilePath $file.FullName
}

Write-Host "Comment removal completed!"
