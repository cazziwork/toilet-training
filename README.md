## デプロイ手順

`7z.exe a build\toilet-training.zip .\node_modules\ .\src .\package.json`

`aws lambda update-function-code --profile copipa777 --function-name alexa-toilet-training --zip-file fileb://./build/toilet-training.zip` --publish

## テストシナリオ
