(function () {
  "use strict";

  /*
    独自選定リスト（2026-09-06確認）
    小学校英語: 文部科学省「小学校外国語活動・外国語 研修ガイドブック」の
    カテゴリー別語彙を参考に、基本訳を独自作成。
    英検4級: 日本英語検定協会が公開する直近3回分
    （2026年度第1回、2025年度第3回、2025年度第2回）の
    問題冊子・選択肢・リスニング原稿を参考に独自選定。
    市販教材のリストや例文は使用していません。
  */

  const irregularVerbs = {
    be: ["was/were", "been", "being", "is"],
    become: ["became", "become", "becoming", "becomes"],
    begin: ["began", "begun", "beginning", "begins"],
    break: ["broke", "broken", "breaking", "breaks"],
    bring: ["brought", "brought", "bringing", "brings"],
    build: ["built", "built", "building", "builds"],
    buy: ["bought", "bought", "buying", "buys"],
    catch: ["caught", "caught", "catching", "catches"],
    choose: ["chose", "chosen", "choosing", "chooses"],
    come: ["came", "come", "coming", "comes"],
    cut: ["cut", "cut", "cutting", "cuts"],
    do: ["did", "done", "doing", "does"],
    draw: ["drew", "drawn", "drawing", "draws"],
    drink: ["drank", "drunk", "drinking", "drinks"],
    drive: ["drove", "driven", "driving", "drives"],
    eat: ["ate", "eaten", "eating", "eats"],
    fall: ["fell", "fallen", "falling", "falls"],
    feel: ["felt", "felt", "feeling", "feels"],
    find: ["found", "found", "finding", "finds"],
    forget: ["forgot", "forgotten", "forgetting", "forgets"],
    get: ["got", "gotten", "getting", "gets"],
    give: ["gave", "given", "giving", "gives"],
    go: ["went", "gone", "going", "goes"],
    grow: ["grew", "grown", "growing", "grows"],
    have: ["had", "had", "having", "has"],
    hear: ["heard", "heard", "hearing", "hears"],
    hold: ["held", "held", "holding", "holds"],
    keep: ["kept", "kept", "keeping", "keeps"],
    know: ["knew", "known", "knowing", "knows"],
    leave: ["left", "left", "leaving", "leaves"],
    lend: ["lent", "lent", "lending", "lends"],
    let: ["let", "let", "letting", "lets"],
    lose: ["lost", "lost", "losing", "loses"],
    make: ["made", "made", "making", "makes"],
    mean: ["meant", "meant", "meaning", "means"],
    meet: ["met", "met", "meeting", "meets"],
    pay: ["paid", "paid", "paying", "pays"],
    put: ["put", "put", "putting", "puts"],
    read: ["read", "read", "reading", "reads"],
    ride: ["rode", "ridden", "riding", "rides"],
    ring: ["rang", "rung", "ringing", "rings"],
    run: ["ran", "run", "running", "runs"],
    say: ["said", "said", "saying", "says"],
    see: ["saw", "seen", "seeing", "sees"],
    sell: ["sold", "sold", "selling", "sells"],
    send: ["sent", "sent", "sending", "sends"],
    show: ["showed", "shown", "showing", "shows"],
    sing: ["sang", "sung", "singing", "sings"],
    sit: ["sat", "sat", "sitting", "sits"],
    sleep: ["slept", "slept", "sleeping", "sleeps"],
    speak: ["spoke", "spoken", "speaking", "speaks"],
    spend: ["spent", "spent", "spending", "spends"],
    stand: ["stood", "stood", "standing", "stands"],
    swim: ["swam", "swum", "swimming", "swims"],
    take: ["took", "taken", "taking", "takes"],
    teach: ["taught", "taught", "teaching", "teaches"],
    tell: ["told", "told", "telling", "tells"],
    think: ["thought", "thought", "thinking", "thinks"],
    understand: ["understood", "understood", "understanding", "understands"],
    wake: ["woke", "woken", "waking", "wakes"],
    wear: ["wore", "worn", "wearing", "wears"],
    win: ["won", "won", "winning", "wins"],
    write: ["wrote", "written", "writing", "writes"]
  };

  const doubleFinal = new Set(["drop", "hop", "plan", "shop", "stop"]);

  function regularVerb(base) {
    let past;
    let ing;
    let third;
    if (base.endsWith("e")) {
      past = base + "d";
      ing = base.slice(0, -1) + "ing";
    } else if (/[^aeiou]y$/.test(base)) {
      past = base.slice(0, -1) + "ied";
      ing = base + "ing";
    } else if (base.endsWith("c")) {
      past = base + "ked";
      ing = base + "king";
    } else if (doubleFinal.has(base)) {
      past = base + base.slice(-1) + "ed";
      ing = base + base.slice(-1) + "ing";
    } else {
      past = base + "ed";
      ing = base + "ing";
    }
    if (/[^aeiou]y$/.test(base)) third = base.slice(0, -1) + "ies";
    else if (/(s|sh|ch|x|z|o)$/.test(base)) third = base + "es";
    else third = base + "s";
    return [past, past, ing, third];
  }

  function makeWord(row, presetId, lesson) {
    const parts = row.split("|");
    const english = parts[0];
    const japanese = parts[1];
    const partOfSpeech = parts[2];
    const displayEnglish = parts[3] || "";
    let forms = { base: english };
    if (partOfSpeech === "verb") {
      const change = irregularVerbs[english] || regularVerb(english);
      forms = { base: english, past: change[0], pastParticiple: change[1], ing: change[2], thirdPerson: change[3] };
    } else if (partOfSpeech === "adjective") {
      forms = { base: english, comparative: "", superlative: "" };
    }
    const word = { english, japanese, partOfSpeech, forms, presetMemberships: { [presetId]: lesson } };
    if (displayEnglish) word.displayEnglish = displayEnglish;
    return word;
  }

  function makePreset(id, name, shortName, sourceNote, lessonNames, rows) {
    const words = [];
    rows.forEach(function (lessonRows, index) {
      lessonRows.split(";").forEach(function (row) {
        words.push(makeWord(row, id, index + 1));
      });
    });
    return { id, name, shortName, sourceNote, lessonSize: 20, lessonNames, words };
  }

  const elementaryRows = [
    "hello|こんにちは|other;goodbye|さようなら|other;yes|はい|other;no|いいえ|other;please|お願いします|other;thanks|ありがとう|other;sorry|ごめんなさい|other;welcome|ようこそ|other;morning|朝|noun;afternoon|午後|noun;evening|夕方|noun;night|夜|noun;name|名前|noun;friend|友達|noun;everyone|みんな|other;who|だれ|other;what|何|other;how|どのように|other;fine|元気な|adjective;well|元気に|other",
    "one|1|noun;two|2|noun;three|3|noun;four|4|noun;five|5|noun;six|6|noun;seven|7|noun;eight|8|noun;nine|9|noun;ten|10|noun;eleven|11|noun;twelve|12|noun;twenty|20|noun;hundred|100|noun;first|1番目|adjective;second|2番目|adjective;third|3番目|adjective;time|時刻|noun;hour|1時間|noun;minute|1分|noun",
    "monday|月曜日|noun|Monday;tuesday|火曜日|noun|Tuesday;wednesday|水曜日|noun|Wednesday;thursday|木曜日|noun|Thursday;friday|金曜日|noun|Friday;saturday|土曜日|noun|Saturday;sunday|日曜日|noun|Sunday;january|1月|noun|January;february|2月|noun|February;march|3月|noun|March;april|4月|noun|April;may|5月|noun|May;june|6月|noun|June;july|7月|noun|July;august|8月|noun|August;september|9月|noun|September;october|10月|noun|October;november|11月|noun|November;december|12月|noun|December;today|今日|noun",
    "family|家族|noun;father|父|noun;mother|母|noun;parent|親|noun;brother|兄弟|noun;sister|姉妹|noun;grandfather|祖父|noun;grandmother|祖母|noun;baby|赤ちゃん|noun;boy|男の子|noun;girl|女の子|noun;child|子ども|noun;teacher|先生|noun;student|生徒|noun;doctor|医者|noun;nurse|看護師|noun;farmer|農家|noun;player|選手|noun;singer|歌手|noun;people|人々|noun",
    "school|学校|noun;class|授業|noun;classroom|教室|noun;desk|机|noun;chair|いす|noun;book|本|noun;notebook|ノート|noun;pencil|鉛筆|noun;pen|ペン|noun;eraser|消しゴム|noun;ruler|定規|noun;bag|かばん|noun;lesson|授業|noun;subject|教科|noun;english|英語|noun|English;math|算数|noun;science|理科|noun;music|音楽|noun;art|図工|noun;homework|宿題|noun",
    "house|家|noun;home|家庭|noun;room|部屋|noun;kitchen|台所|noun;bedroom|寝室|noun;bathroom|浴室|noun;door|ドア|noun;window|窓|noun;table|テーブル|noun;bed|ベッド|noun;garden|庭|noun;park|公園|noun;library|図書館|noun;station|駅|noun;store|店|noun;hospital|病院|noun;restaurant|レストラン|noun;zoo|動物園|noun;place|場所|noun;town|町|noun",
    "food|食べ物|noun;rice|ご飯|noun;bread|パン|noun;egg|卵|noun;meat|肉|noun;fish|魚|noun;vegetable|野菜|noun;fruit|果物|noun;apple|りんご|noun;banana|バナナ|noun;orange|オレンジ|noun;milk|牛乳|noun;water|水|noun;juice|ジュース|noun;tea|お茶|noun;breakfast|朝食|noun;lunch|昼食|noun;dinner|夕食|noun;cake|ケーキ|noun;delicious|おいしい|adjective",
    "animal|動物|noun;dog|犬|noun;cat|猫|noun;bird|鳥|noun;rabbit|うさぎ|noun;horse|馬|noun;monkey|さる|noun;bear|くま|noun;lion|ライオン|noun;elephant|象|noun;tree|木|noun;flower|花|noun;mountain|山|noun;river|川|noun;sea|海|noun;sky|空|noun;sun|太陽|noun;moon|月|noun;star|星|noun;weather|天気|noun",
    "body|体|noun;head|頭|noun;face|顔|noun;eye|目|noun;ear|耳|noun;nose|鼻|noun;mouth|口|noun;hand|手|noun;arm|腕|noun;leg|脚|noun;foot|足|noun;tooth|歯|noun;hair|髪|noun;health|健康|noun;sick|病気の|adjective;hungry|空腹の|adjective;thirsty|喉が渇いた|adjective;tired|疲れた|adjective;strong|強い|adjective;healthy|健康な|adjective",
    "red|赤|noun;blue|青|noun;yellow|黄色|noun;green|緑|noun;white|白|noun;black|黒|noun;color|色|noun;circle|円|noun;square|正方形|noun;triangle|三角形|noun;shirt|シャツ|noun;coat|コート|noun;dress|ドレス|noun;skirt|スカート|noun;pants|ズボン|noun;shoes|靴|noun;hat|帽子|noun;cap|ぼうし|noun;clothes|衣服|noun;wear|身につける|verb",
    "sport|スポーツ|noun;soccer|サッカー|noun;baseball|野球|noun;basketball|バスケットボール|noun;tennis|テニス|noun;volleyball|バレーボール|noun;swimming|水泳|noun;hobby|趣味|noun;game|ゲーム|noun;piano|ピアノ|noun;guitar|ギター|noun;picture|絵|noun;movie|映画|noun;story|物語|noun;festival|祭り|noun;trip|旅行|noun;camp|キャンプ|noun;team|チーム|noun;practice|練習する|verb;enjoy|楽しむ|verb",
    "be|〜である|verb;have|持っている|verb;do|する|verb;go|行く|verb;come|来る|verb;get|得る|verb;make|作る|verb;take|取る|verb;see|見る|verb;look|見る|verb;watch|見る|verb;hear|聞こえる|verb;listen|聞く|verb;speak|話す|verb;say|言う|verb;tell|伝える|verb;read|読む|verb;write|書く|verb;study|勉強する|verb;learn|学ぶ|verb",
    "eat|食べる|verb;drink|飲む|verb;cook|料理する|verb;play|遊ぶ|verb;sing|歌う|verb;dance|踊る|verb;run|走る|verb;walk|歩く|verb;swim|泳ぐ|verb;ride|乗る|verb;stand|立つ|verb;sit|座る|verb;open|開ける|verb;close|閉める|verb;use|使う|verb;help|助ける|verb;want|欲しい|verb;like|好む|verb;live|住む|verb;visit|訪れる|verb",
    "big|大きい|adjective;small|小さい|adjective;long|長い|adjective;short|短い|adjective;new|新しい|adjective;old|古い|adjective;good|良い|adjective;bad|悪い|adjective;hot|暑い|adjective;cold|寒い|adjective;warm|暖かい|adjective;cool|涼しい|adjective;happy|うれしい|adjective;sad|悲しい|adjective;fun|楽しい|adjective;busy|忙しい|adjective;easy|簡単な|adjective;difficult|難しい|adjective;beautiful|美しい|adjective;favorite|お気に入りの|adjective",
    "country|国|noun;city|都市|noun;world|世界|noun;japan|日本|noun|Japan;america|アメリカ|noun|America;canada|カナダ|noun|Canada;australia|オーストラリア|noun|Australia;india|インド|noun|India;china|中国|noun|China;bus|バス|noun;train|電車|noun;car|車|noun;bicycle|自転車|noun;airport|空港|noun;road|道路|noun;map|地図|noun;left|左|noun;right|右|noun;near|近くに|other;far|遠くに|other"
  ];

  const eikenRows = [
    "arrive|到着する|verb;ask|尋ねる|verb;become|〜になる|verb;begin|始める|verb;bring|持ってくる|verb;buy|買う|verb;call|電話する|verb;carry|運ぶ|verb;catch|捕まえる|verb;change|変える|verb;clean|掃除する|verb;finish|終える|verb;forget|忘れる|verb;give|与える|verb;keep|保つ|verb;leave|去る|verb;meet|会う|verb;remember|覚えている|verb;send|送る|verb;show|見せる|verb",
    "answer|答え|noun;birthday|誕生日|noun;club|部活動|noun;computer|コンピューター|noun;dream|夢|noun;email|メール|noun;exam|試験|noun;holiday|休日|noun;idea|考え|noun;letter|手紙|noun;money|お金|noun;party|パーティー|noun;question|質問|noun;report|報告書|noun;weekend|週末|noun;work|仕事|noun;teach|教える|verb;understand|理解する|verb;wait|待つ|verb;workout|運動|noun",
    "aunt|おば|noun;uncle|おじ|noun;cousin|いとこ|noun;neighbor|隣人|noun;member|一員|noun;library|図書館|noun;museum|博物館|noun;office|事務所|noun;post|郵便|noun;bank|銀行|noun;hotel|ホテル|noun;market|市場|noun;ticket|切符|noun;travel|旅行する|verb;stay|滞在する|verb;move|引っ越す|verb;turn|曲がる|verb;cross|渡る|verb;inside|内側に|other;outside|外側に|other",
    "afraid|怖い|adjective;careful|注意深い|adjective;different|異なる|adjective;early|早い|adjective;famous|有名な|adjective;friendly|親しみやすい|adjective;important|重要な|adjective;interesting|興味深い|adjective;kind|親切な|adjective;late|遅い|adjective;popular|人気の|adjective;ready|準備ができた|adjective;same|同じ|adjective;slow|遅い|adjective;special|特別な|adjective;sure|確かな|adjective;young|若い|adjective;always|いつも|other;usually|ふつうは|other;sometimes|時々|other",
    "already|すでに|other;again|再び|other;ago|前に|other;before|前に|other;after|後に|other;around|周りに|other;during|〜の間に|other;each|それぞれ|other;enough|十分に|other;ever|これまでに|other;later|後で|other;never|決して〜ない|other;often|しばしば|other;soon|すぐに|other;together|一緒に|other;also|〜もまた|other;because|なぜなら|other;both|両方|other;another|もう一つの|other;without|〜なしで|other"
  ];

  const elementaryNames = ["あいさつ", "数と時刻", "曜日と月", "家族と人", "学校", "家と町", "食べ物", "動物と自然", "体と健康", "色・形・服", "スポーツと趣味", "基本動作1", "基本動作2", "様子と気持ち", "国・交通・道案内"];
  const eikenNames = ["よく使う動詞", "学校・生活", "人・場所・移動", "形容詞と頻度", "副詞・つなぎ語"];

  window.MY_WORD_PRESETS = [
    makePreset("elementary-300", "小学校英語 基礎300語（文科省教材を参考に独自選定）", "小学校英語300語", "文部科学省の小学校外国語教材・研修ガイドブックを参考に、アプリ用に独自選定しています。", elementaryNames, elementaryRows),
    makePreset("eiken4-100", "英検4級対策 基礎100語（公式過去問を参考に独自選定）", "英検4級100語", "英検4級の公式過去問を参考に、日常的に重要な語をアプリ用に独自選定しています。", eikenNames, eikenRows)
  ];
})();
