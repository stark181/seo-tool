function analyzeTitle() {
  const title = document.getElementById('titleInput').value;
  let score = 100;
  let advice = [];

  if (title.length < 28) {
    score -= 10;
    advice.push("タイトルが短すぎます。もう少し情報を追加しましょう。");
  } else if (title.length > 40) {
    score -= 10;
    advice.push("タイトルが長すぎます。重要語句を絞りましょう。");
  }

  if (!title.match(/(最新|2025|完全|初心者|おすすめ|比較|安い)/)) {
    score -= 10;
    advice.push("キャッチーな語句（例：最新、おすすめ）が含まれていません。");
  }

  const words = title.split(/[\s　]/);
  const wordCount = {};
  words.forEach(w => { wordCount[w] = (wordCount[w] || 0) + 1; });
  if (Object.values(wordCount).some(c => c > 2)) {
    score -= 10;
    advice.push("同じ単語が繰り返されています。言い換えを検討しましょう。");
  }

  document.getElementById('result').innerHTML = `
    <h2>スコア：${score}点</h2>
    <ul>${advice.map(a => `<li>${a}</li>`).join("")}</ul>
  `;
}
