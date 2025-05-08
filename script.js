function analyzeTitle() {
  const title = document.getElementById('titleInput').value;
  let totalScore = 100;
  let advice = [];
  let searchIntent = 100, ctrFactors = 100, expression = 100;

  // ① 文字数
  if (title.length < 28) {
    totalScore -= 10; expression -= 10;
    advice.push("タイトルが短すぎます。");
  } else if (title.length > 50) {
    totalScore -= 10; expression -= 10;
    advice.push("タイトルが長すぎます。");
  }

  // ② メインキーワード
  const keywords = ["SEO", "検索", "初心者", "最新", "2025", "おすすめ"];
  let keywordFound = false;
  for (const kw of keywords) {
    if (title.includes(kw)) {
      keywordFound = true;
      if (title.startsWith(kw)) totalScore += 5;
    }
  }
  if (!keywordFound) {
    totalScore -= 10; searchIntent -= 15;
    advice.push("主要キーワードが含まれていません。");
  }

  // ③ キャッチコピー語
  const catchyWords = ["比較", "ランキング", "完全", "簡単"];
  if (!catchyWords.some(w => title.includes(w))) {
    ctrFactors -= 10;
    advice.push("比較やランキングなどのキャッチワードが不足しています。");
  }

  // ④ 禁止語
  const spamWords = ["最強", "絶対", "爆安", "衝撃"];
  if (spamWords.some(w => title.includes(w))) {
    totalScore -= 10; expression -= 10;
    advice.push("誇張表現（最強・絶対など）は避けましょう。");
  }

  // ⑤ 検索意図との一致（共起語）
  const intentWords = ["順位", "改善", "Google", "方法", "解説"];
  if (!intentWords.some(w => title.includes(w))) {
    searchIntent -= 10;
    advice.push("検索意図に関連する語句が不足しています。");
  }

  // ⑥ CTR向上要素（数字）
  if (!title.match(/\d/)) {
    ctrFactors -= 10;
    advice.push("数字（例：5選、2025年）を含めるとCTRが向上します。");
  }

  // ⑦ 感情ワード
  const emotionWords = ["簡単", "安全", "早い", "便利"];
  if (!emotionWords.some(w => title.includes(w))) {
    expression -= 5;
    advice.push("ポジティブな表現を追加すると良いでしょう。");
  }

  // ⑧ リズム（文字種バランス：簡易判定）
  const kanaRatio = (title.replace(/[^ぁ-んァ-ンー]/g, '').length / title.length);
  if (kanaRatio > 0.5) {
    expression -= 5;
    advice.push("ひらがなが多すぎます。表現を調整しましょう。");
  }

  // ⑨ 重複単語
  const words = title.split(/[\s　]/);
  const wordCount = {};
  words.forEach(w => { wordCount[w] = (wordCount[w] || 0) + 1; });
  if (Object.values(wordCount).some(c => c > 2)) {
    totalScore -= 10; expression -= 10;
    advice.push("同じ単語が繰り返されています。");
  }

  // ⑩ 疑問形
  if (title.includes("とは") || title.includes("方法") || title.includes("なぜ")) {
    ctrFactors += 5;
  }

  // 最終スコアの調整
  totalScore = Math.min(Math.max(totalScore, 0), 100);
  searchIntent = Math.min(Math.max(searchIntent, 0), 100);
  ctrFactors = Math.min(Math.max(ctrFactors, 0), 100);
  expression = Math.min(Math.max(expression, 0), 100);

  // バーのHTML
  const barHTML = `
    <div>【検索意図】 ${searchIntent}点
      <div class="bar-container">
        <div class="bar bar-intent" style="width:${searchIntent}%;"></div>
      </div>
    </div>
    <div>【CTR要素】 ${ctrFactors}点
      <div class="bar-container">
        <div class="bar bar-ctr" style="width:${ctrFactors}%;"></div>
      </div>
    </div>
    <div>【表現・自然さ】 ${expression}点
      <div class="bar-container">
        <div class="bar bar-expression" style="width:${expression}%;"></div>
      </div>
    </div>
  `;

  // 結果表示
  document.getElementById('result').innerHTML = `
    <h2>総合スコア：${totalScore}点</h2>
    ${barHTML}
    <ul>${advice.map(a => `<li>${a}</li>`).join("")}</ul>
  `;
}
