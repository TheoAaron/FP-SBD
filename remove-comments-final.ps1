# PowerShell script to remove ALL comments from JavaScript and TypeScript files

function Remove-AllComments {
    param([string]$FilePath)
    
    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Remove single-line comments
        $content = $content -replace '(?m)(?<!:)//.*$', ''
        
        # Remove multi-line comments
        $content = $content -replace '/\*[\s\S]*?\*/', ''
        
        # Remove JSX comments
        $content = $content -replace '\{\s*/\*[\s\S]*?\*/\s*\}', ''
        
        # Clean up multiple blank lines
        $content = $content -replace '(\r?\n){3,}', "`n`n"
        
        # Remove trailing whitespace
        $content = $content -replace '[ \t]+(\r?\n)', '$1'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $FilePath -Value $content -Encoding UTF8
            Write-Host "Processed: $FilePath" -ForegroundColor Green
        }
        
    } catch {
        Write-Host "Error processing $FilePath" -ForegroundColor Red
    }
}

Write-Host "Starting comment removal..." -ForegroundColor Yellow

# Get frontend files
$frontendFiles = Get-ChildItem -Recurse -Path "frontend\src" -Include "*.tsx","*.ts","*.js","*.jsx" | 
    Where-Object { $_.FullName -notlike "*node_modules*" }

# Get backend files  
$backendFiles = Get-ChildItem -Recurse -Path "backend" -Include "*.js" | 
    Where-Object { $_.FullName -notlike "*node_modules*" }

Write-Host "Processing frontend files..." -ForegroundColor Cyan
foreach ($file in $frontendFiles) {
    Remove-AllComments -FilePath $file.FullName
}

Write-Host "Processing backend files..." -ForegroundColor Cyan
foreach ($file in $backendFiles) {
    Remove-AllComments -FilePath $file.FullName
}

Write-Host "Comment removal completed!" -ForegroundColor Green
