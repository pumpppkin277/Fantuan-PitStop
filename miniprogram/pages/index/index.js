Page({
  data: {
    allTreasures: [],
    currentTreasure: null,
    showBox: false,
    isBoxOpen: false,
    isBoxShaking: false,
    isFlashing: false, 
    
    // 基础资源路径
    boxClosedUrl: 'cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/开屏图_透明底.png',
    boxOpenUrl: 'cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/百宝箱-打开-浅色底.png',

    // --- 故事导览配置 ---
    isFirstVisit: false,
    tourStep: 0,
    tourCards: [
      { text: "hello饭团，欢迎来到你的专属情绪维修站：饭团PitStop，我是小猫站长Ollie。", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/Ollie.png", role: "小猫站长 Ollie" },
      { text: "当你感到疲惫、焦虑，或者只想停下来歇会儿的时候，这里永远给你留了一个位置。", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/Ollie躺平.png", role: "小猫站长 Ollie" },
      { text: "让我先来介绍一下其他小伙伴，他们会和我一起守护你的好心情，来认识他们一下吧！", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/全员集合.png", role: "饭团PitStop的小主人们" },
      { text: "我是Miles，一名无拘无束的赛车手。当你想吹吹风，欢迎来我的副驾。", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/miles.png", role: "赛车手 Miles" },
      { text: "我是Ace，一颗不守规矩的网球。我会带你穿过所有焦虑、抑郁和低落的时刻。", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/ace.png", role: "网球 Ace" },
      { text: "我是Lunch，一只名副其实的快乐小狗。我想把我的高能量分你一些！", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/lunch.png", role: "小狗 Lunch" },
      { text: "我是April，一只会魔法的小兔子。我会把你所有的烦恼像变戏法一样藏进我的耳朵里。", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/April.png", role: "兔子 April" },
      { text: "我是 Fifteen，一只从来不焦虑、不内耗的卡皮巴拉。我心里的恒温箱永远为你敞开。", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/fifteen.png", role: "卡皮巴拉 Fifteen" },
      { text: "我是 Padel，一只擅长划水摸鱼的小鸭子。跟着我一起轻松快乐地玩玩人生这场游戏吧！", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/padel.png", role: "小鸭子 Padel" },
      { text: "以后不开心了就来敲敲箱子，听听我们想对你说的话，希望能让你会心一笑。\nWe are always here for you.", image_url: "cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/全员集合-V字.png", role: "饭团PitStop的小主人们" }
    ]
  },

  onLoad: function() {
    const tourCount = wx.getStorageSync('tourCount') || 0;
    if (tourCount < 5) {
      this.setData({ isFirstVisit: true });
      setTimeout(() => {
        this.handleOpenSequence();
      }, 300); // 缩短延迟为 300ms
    }

    this.loadAllTreasures();
  },

  // 云数据库单次查询有数量上限，分批读取，确保全部卡片都能参与抽取。
  loadAllTreasures: async function() {
    const collection = wx.cloud.database().collection('fantuan_treasures');
    const pageSize = 20;
    const treasures = [];

    try {
      while (true) {
        const res = await collection.skip(treasures.length).limit(pageSize).get();
        treasures.push(...res.data);
        if (res.data.length < pageSize) break;
      }
      this.setData({ allTreasures: treasures });
      console.info(`已加载 ${treasures.length} 条饭团卡片`);
    } catch (error) {
      console.error('卡片数据加载失败', error);
      wx.showToast({ title: '卡片加载失败，请稍后重试', icon: 'none' });
    }
  },

  handleOpenSequence: function() {
    if (this.data.isBoxOpen || this.data.isFlashing) return;

    this.setData({ isFlashing: true, isBoxShaking: true }); 
    if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' });

    setTimeout(() => {
      this.setData({ isBoxOpen: true, isFlashing: false, isBoxShaking: false });
      if (this.data.isFirstVisit) {
        this.setData({ currentTreasure: this.data.tourCards[0], showBox: true, tourStep: 1 });
      } else {
        this.showRandomCard();
      }
    }, 200);
  },

  nextTourStep: function() {
    let nextIndex = this.data.tourStep;
    if (nextIndex < this.data.tourCards.length) {
      this.setData({ currentTreasure: this.data.tourCards[nextIndex], tourStep: nextIndex + 1 });
    } else {
      let tourCount = wx.getStorageSync('tourCount') || 0;
      tourCount++;
      wx.setStorageSync('tourCount', tourCount);
      this.setData({ isFirstVisit: false });
      this.closeBox();
    }
  },

  // 核心逻辑：不重复的随机抽取
  showRandomCard: function() {
    const all = this.data.allTreasures;
    if (all.length === 0) {
      wx.showToast({ title: '补给正在装填，请稍后再试', icon: 'none' });
      this.closeBox();
      return;
    }
    let shownIds = wx.getStorageSync('shownIds') || [];
    let available = all.filter(item => !shownIds.includes(item.id_code));

    // 全部看完后自动开启新一轮，抽取次数不设上限。
    if (available.length === 0) {
      shownIds = [];
      available = all;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];

    shownIds.push(selected.id_code);
    wx.setStorageSync('shownIds', shownIds);

    this.setData({
      currentTreasure: selected,
      showBox: true
    });
  },

  closeBox: function() {
    this.setData({ showBox: false, isBoxOpen: false, tourStep: 0 });
  },

  preventBubble: function() {}
});
