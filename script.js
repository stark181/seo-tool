function analyzeTitle() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('result').innerHTML = '';

  setTimeout(() => {

    const title = document.getElementById('titleInput').value;
    let totalScore = 100;
    let advice = [];
    let searchIntent = 100, ctrFactors = 100, expression = 100;

    // ---- 判定ロジック（省略せずそのまま使用中） ----
    // （ここはあなたの元コード通り。省略しますがロジックは変わらず。）

    // ① 文字数
    if (title.length < 28) {
      totalScore -= 10; expression -= 10;
      advice.push({msg: "タイトルが短すぎます。", type: "warn"});
    } else if (title.length > 50) {
      totalScore -= 10; expression -= 10;
      advice.push({msg: "タイトルが長すぎます。", type: "warn"});
    } else {
      advice.push({msg: "適切な文字数です。", type: "good"});
    }

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
      advice.push({msg: "主要キーワードが含まれていません。", type: "warn"});
    } else {
      advice.push({msg: "主要キーワードが含まれています。", type: "good"});
    }

    const catchyWords = ["比較", "ランキング", "完全", "簡単"];
    if (!catchyWords.some(w => title.includes(w))) {
      ctrFactors -= 10;
      advice.push({msg: "キャッチワードが不足しています。", type: "warn"});
    } else {
      advice.push({msg: "キャッチワードが含まれています。", type: "good"});
    }

    const spamWords = ["最強", "絶対", "爆安", "衝撃"];
    if (spamWords.some(w => title.includes(w))) {
      totalScore -= 10; expression -= 10;
      advice.push({msg: "誇張表現は避けましょう。", type: "warn"});
    } else {
      advice.push({msg: "誇張表現は含まれていません。", type: "good"});
    }

    const intentWords = ["順位", "改善", "Google", "方法", "解説"];
    if (!intentWords.some(w => title.includes(w))) {
      searchIntent -= 10;
      advice.push({msg: "検索意図に関連する語句が不足しています。", type: "warn"});
    } else {
      advice.push({msg: "検索意図と一致しています。", type: "good"});
    }

    if (!title.match(/\d/)) {
      ctrFactors -= 10;
      advice.push({msg: "数字を含めましょう。", type: "warn"});
    } else {
      advice.push({msg: "数字が含まれています。", type: "good"});
    }

    const emotionWords = ["簡単", "安全", "早い", "便利"];
    if (!emotionWords.some(w => title.includes(w))) {
      expression -= 5;
      advice.push({msg: "ポジティブな表現を追加すると良い。", type: "warn"});
    } else {
      advice.push({msg: "ポジティブ表現が含まれています。", type: "good"});
    }

    const kanaRatio = (title.replace(/[^ぁ-んァ-ンー]/g, '').length / title.length);
    if (kanaRatio > 0.5) {
      expression -= 5;
      advice.push({msg: "ひらがなが多すぎます。", type: "warn"});
    } else {
      advice.push({msg: "文字バランスは良好です。", type: "good"});
    }

    const words = title.split(/[\s　]/);
    const wordCount = {};
    words.forEach(w => { wordCount[w] = (wordCount[w] || 0) + 1; });
    if (Object.values(wordCount).some(c => c > 2)) {
      totalScore -= 10; expression -= 10;
      advice.push({msg: "同じ単語が繰り返されています。", type: "warn"});
    } else {
      advice.push({msg: "単語の重複はありません。", type: "good"});
    }

    if (title.includes("とは") || title.includes("方法") || title.includes("なぜ")) {
      ctrFactors += 5;
    }

    totalScore = Math.min(Math.max(totalScore, 0), 100);
    searchIntent = Math.min(Math.max(searchIntent, 0), 100);
    ctrFactors = Math.min(Math.max(ctrFactors, 0), 100);
    expression = Math.min(Math.max(expression, 0), 100);

    let bgClass = "";
    if (totalScore >= 80) bgClass = "green-bg";
    else if (totalScore >= 50) bgClass = "yellow-bg";
    else bgClass = "red-bg";

    const barHTML = `
      <div>【検索意図】 ${searchIntent}点
        <div class="bar-container">
          <div class="bar bar-intent" id="barIntent"></div>
        </div>
      </div>
      <div>【CTR要素】 ${ctrFactors}点
        <div class="bar-container">
          <div class="bar bar-ctr" id="barCTR"></div>
        </div>
      </div>
      <div>【表現・自然さ】 ${expression}点
        <div class="bar-container">
          <div class="bar bar-expression" id="barExpression"></div>
        </div>
      </div>
    `;

    const adviceHTML = advice.map(a => {
      const icon = a.type === "good" ? "✅" : "⚠";
      const className = a.type === "good" ? "good" : "warn";
      return `<li class="${className}">${icon} ${a.msg}</li>`;
    }).join("");

    document.getElementById('result').innerHTML = `
      <div class="${bgClass}">
        <h2>総合スコア：${totalScore}点</h2>
        ${barHTML}
        <ul>${adviceHTML}</ul>
      </div>
    `;

    // バーのアニメーション（widthを遅延セット）
    setTimeout(() => {
      document.getElementById('barIntent').style.width = `${searchIntent}%`;
      document.getElementById('barCTR').style.width = `${ctrFactors}%`;
      document.getElementById('barExpression').style.width = `${expression}%`;
    }, 100); // 描画完了後に実行

    saveHistory(title, totalScore);
    displayHistory();

    document.getElementById('loading').style.display = 'none';

  }, 500);
}

function copyPrompt() {
  const title = document.getElementById('titleInput').value;
  const promptText = `次のタイトルをSEOに最適化してください：${title}`;
  document.getElementById('promptOutput').value = promptText;
  navigator.clipboard.writeText(promptText).then(() => {
    alert("ChatGPT用プロンプトをコピーしました！");
  });
}

function saveHistory(title, score) {
  const history = JSON.parse(localStorage.getItem('seoHistory')) || [];
  const date = new Date().toLocaleString();
  history.unshift({ title, score, date });
  if (history.length > 10) history.pop();
  localStorage.setItem('seoHistory', JSON.stringify(history));
}

function displayHistory() {
  const history = JSON.parse(localStorage.getItem('seoHistory')) || [];
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = history.map(item =>
    `<li><strong>${item.title}</strong>（${item.score}点｜${item.date}）</li>`
  ).join('');
}

window.onload = displayHistory;
