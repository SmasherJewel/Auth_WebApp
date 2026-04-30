$ErrorActionPreference = "Stop"

$backendDir = Join-Path $PSScriptRoot "auth-backend"
$envFile = Join-Path $backendDir ".env"
$port = 8082

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $name, $value = $line.Split("=", 2)
            [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), "Process")
        }
    }
}

$listeners = netstat -ano | Select-String ":$port\s+.*LISTENING"
foreach ($listener in $listeners) {
    $parts = ($listener.ToString() -split "\s+") | Where-Object { $_ }
    $processId = [int]$parts[-1]
    Write-Host "Stopping existing process $processId on port $port..."
    Stop-Process -Id $processId -Force
}

Set-Location $backendDir
mvn.cmd spring-boot:run
