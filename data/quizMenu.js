// クイズコース一覧
const quizCourses = [
  {
    id: "invincible-moves",
    title: "OD完全無敵あるなしクイズ",
    description: "打撃・投げのみ無敵などに注意",
    dataFile: "questionsData1.js",
  },
  {
    id: "medium-kick-cancel-rush",
    title: "中足キャンセルラッシュあるなしクイズ",
    description: "中足＝下段の中攻撃",
    dataFile: "questionsData2.js",
  },
  //  {
  //    id: "test",
  //    title: "テスト",
  //    description: "動作チェック用のコース",
  //    dataFile: "questionsData3.js",
  //  },
];

// データファイルを自動的に読み込む
quizCourses.forEach((course) => {
  const script = document.createElement("script");
  script.src = "data/" + course.dataFile;
  document.head.appendChild(script);
});
