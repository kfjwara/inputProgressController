# inputProgressController
フォームの入力進捗をサポートするjQueryプラグインです。

# 主な機能
・入力項目が空かどうかリアルタイムでチェックします。
・フォーム内の入力項目数に応じた進捗率を表示できます。

# セットアップ
1. jQuery3.6以上のバージョンを読み込みます。
2. jquery.inputProgressController.jsを読み込みます。

# 使い方

## HTML

formに任意のID、input要素にjs-input-fieldのクラスを付与してください。
入力率はjs-step-progress-valueのクラス要素に更新されます。

```
<form id="form">
    <input type="text" id="input1" class="js-input-field" />
	入力率<div class="js-step-progress-value"></div>％
</form>
```

## css

本プラグインにテーマｃｓｓはありません。入力率のデザインなどは任意のcssをご利用ください。

## javascript

フォームidを指定して起動してください。クラスでも動きますが推奨しません。

```
$('#form').inputProgressController();
```


# オプション

プラグイン動作のクラス名やカラーををカスタマイズできます。起動時に指定してください。

fieldClass: バリデーションを適用するフィールドのクラス名（デフォルト: "js-input-field"）
fieldOkClass: バリデーションを通過したフィールドに適用されるクラス名（デフォルト: "js-input-field--ok"）
fieldErrorClass: バリデーションエラー時に適用されるクラス名（デフォルト: "js-input-field--error"）
progressBarClass: 入力率のクラス名（デフォルト: "js-step-progress-bar"）※styleプロパティのwidthに値が反映されます。
progressValueClass: 進捗値を表示するクラス名（デフォルト: "js-step-progress-value"）※入力率を文字列で出力します。

```
$('#form').inputProgressController({
	fieldOkColor: "#F8E58C", // 入力OK時の入力項目の背景色をカスタム
	fieldErrorColor: "#DDEEFF" // 空入力時の入力項目の背景色をカスタム
});      
```

# トリガー関数

リアルタイムバリデーションなど、独自の処理と連携できるよう、任意で呼び出せるトリガー関数を用意しています。

formValidateRun
現在のフォーム全体の入力状態をチェックし、入力率を更新します。フォームを初期化する際や、特定の処理の後に全体状態を確認できます。
```
$('#form').inputProgressController('formValidateRun');
```
progressUpdate
入力率を更新します。formValidateRunとは異なり、入力空チェックを行わず、現在のフォーム状態で入力率を更新します。
```
$('#form').inputProgressController('progressUpdate');
```
fieldValidation
任意のIDの入力項目で空チェックを行います。
また、特定の処理（空欄以外のバリデーションなど）で入力状態を任意に操作したい場合、第３引数にtrueで入力ＯＫ。falseで入力ＮＧの状態にできます。

例：入力されている状態でもＮＧにしたい
```
$('#form').inputProgressController('fieldValidation', $jq(`#input1`), $("#form"), false);
```
