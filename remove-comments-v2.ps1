# PowerShell script to thoroughly remove ALL comments from JavaScript and TypeScript files

function Remove-AllComments {
    param (
        [string]$FilePath
    )
    
    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Remove single-line comments (// ...) - more aggressive approach
        $content = $content -replace '(?<!:)//.*$', '' -replace '(?m)(?<!:)//.*$', ''
        
        # Remove multi-line comments (/* ... */) - all of them
        $content = $content -replace '/\*[\s\S]*?\*/', ''
        
        # Remove JSX comments {/* ... */}
        $content = $content -replace '\{\s*/\*[\s\S]*?\*/\s*\}', ''
        
        # Remove any remaining comment patterns
        $content = $content -replace '^\s*//.*\r?\n', '' -replace '(?m)^\s*//.*\r?\n', ''
        
        # Clean up multiple blank lines (keep max 2 consecutive newlines)
        $content = $content -replace '(\r?\n){3,}', "`n`n"
        
        # Remove trailing whitespace from lines
        $content = $content -replace '[ \t]+(\r?\n)', '$1'
          # Only write if content changed
        if ($content -ne $originalContent) {
            Set-Content -Path $FilePath -Value $content -Encoding UTF8
            Write-Host "✓ Processed: $($FilePath)" -ForegroundColor Green
        } else {
            Write-Host "- No changes: $($FilePath)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "✗ Error processing $FilePath`: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Starting comprehensive comment removal..." -ForegroundColor Yellow

# Get all JavaScript/TypeScript files in frontend and backend (excluding node_modules)
$frontendFiles = Get-ChildItem -Recurse -Path "frontend\src" -Include "*.tsx","*.ts","*.js","*.jsx" | 
    Where-Object { $_.FullName -notlike "*node_modules*" -and $_.Name -notlike "*.d.ts" -and $_.Name -notlike "*.min.js" }

$backendFiles = Get-ChildItem -Recurse -Path "backend" -Include "*.js" | 
    Where-Object { $_.FullName -notlike "*node_modules*" -and $_.Name -ne "package.json" -and $_.Name -notlike "*.min.js" }

Write-Host "`nProcessing $($frontendFiles.Count) frontend files..." -ForegroundColor Cyan
foreach ($file in $frontendFiles) {
    Remove-AllComments -FilePath $file.FullName
}

Write-Host "`nProcessing $($backendFiles.Count) backend files..." -ForegroundColor Cyan  
foreach ($file in $backendFiles) {
    Remove-AllComments -FilePath $file.FullName
}

Write-Host "🎉 Comment removal completed!" -ForegroundColor Green
Write-Host "Total files processed: $($frontendFiles.Count + $backendFiles.Count)" -ForegroundColor Yellow
