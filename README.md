## デプロイ手順

`7z.exe a build\target.zip .\node_modules\ .\src .\package.json`

`aws lambda update-function-code --profile copipa777 --function-name alexa-toilet-training --zip-file fileb://./build/target.zip` --publish

## テストシナリオ
トイレトレーニングひらいて  ヘルプ  ストップして

トイレトレーニングで発表したよ
トイレトレーニングで成功したよ
トイレトレーニングで失敗したよ