Page({
  data: {
    allTreasures: [],
    currentTreasure: null,
    showBox: false,
    isBoxOpen: false,
    isBoxShaking: false,
    isFlashing: false, 
    
    // 基础资源路径
    boxClosedUrl: 'cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/开屏图_透明底.png',
    boxOpenUrl: 'cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/百宝箱-打开-浅色底.png', 

    // --- 故事导览配置 ---
    isFirstVisit: false,
    tourStep: 0,
    tourCards: [
      { text: "hello饭团，欢迎来到你的专属情绪维修站：饭团PitStop，我是小猫站长Ollie。", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/Ollie.png", role: "小猫站长 Ollie" },
      { text: "当你感到疲惫、焦虑，或者只想停下来歇会儿的时候，这里永远给你留了一个位置。", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/Ollie躺平.png", role: "小猫站长 Ollie" },
      { text: "让我先来介绍一下其他小伙伴，他们会和我一起守护你的好心情，来认识他们一下吧！", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/全员集合.png", role: "饭团PitStop的小主人们" },
      { text: "我是Miles，一名无拘无束的赛车手。当你想吹吹风，欢迎来我的副驾。", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/miles.png", role: "赛车手 Miles" },
      { text: "我是Ace，一颗不守规矩的网球。我会带你穿过所有焦虑、抑郁和低落的时刻。", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/ace.png", role: "网球 Ace" },
      { text: "我是Lunch，一只名副其实的快乐小狗。我想把我的高能量分你一些！", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/lunch.png", role: "小狗 Lunch" },
      { text: "我是April，一只会魔法的小兔子。我会把你所有的烦恼像变戏法一样藏进我的耳朵里。", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/April.png", role: "兔子 April" },
      { text: "我是 Fifteen，一只从来不焦虑、不内耗的卡皮巴拉。我心里的恒温箱永远为你敞开。", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/fifteen.png", role: "卡皮巴拉 Fifteen" },
      { text: "我是 Padel，一只擅长划水摸鱼的小鸭子。跟着我一起轻松快乐地玩玩人生这场游戏吧！", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/padel.png", role: "小鸭子 Padel" },
      { text: "以后不开心了就来敲敲箱子，听听我们想对你说的话，希望能让你会心一笑。\nWe are always here for you.", image_url: "cloud://cloud1-0g1pkke1764ea351.636c-cloud1-0g1pkke1764ea351-1418310788/全员集合-V字.png", role: "饭团PitStop的小主人们" }
    ]
  },

  onLoad: function() {
    this.checkDailyLimit(); // 检查每日次数

    const tourCount = wx.getStorageSync('tourCount') || 0;
    if (tourCount < 5) {
      this.setData({ isFirstVisit: true });
      setTimeout(() => {
        this.handleOpenSequence();
      }, 300); // 缩短延迟为 300ms
    }

    const db = wx.cloud.database(); 
    db.collection('fantuan_treasures').get({
      success: res => {
        this.setData({ allTreasures: res.data }); 
      }
    });
  },

  // 核心逻辑：检查并重置每日限制
  checkDailyLimit: function() {
    const today = new Date().toDateString(); // 获取当前日期字符串
    const lastDate = wx.getStorageSync('lastDate');

    if (lastDate !== today) {
      // 如果日期变了，重置点击次数和已看卡片列表
      wx.setStorageSync('lastDate', today);
      wx.setStorageSync('dailyClicks', 0);
      wx.setStorageSync('shownIds', []);
    }
  },

  handleOpenSequence: function() {
    if (this.data.isBoxOpen || this.data.isFlashing) return; 

    // 如果不是导览模式，需要检查每日限制
    if (!this.data.isFirstVisit) {
      const dailyClicks = wx.getStorageSync('dailyClicks') || 0;
      if (dailyClicks >= 3) {
        wx.showModal({
          title: '休息时间到 💤',
          content: '今天的补给已经装满了，明天再来听新耳语吧！',
          showCancel: false,
          confirmColor: '#8B7E66'
        });
        return;
      }
    }

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
    const shownIds = wx.getStorageSync('shownIds') || [];
    
    // 过滤掉今天已经看过的卡片
    const available = all.filter(item => !shownIds.includes(item.id_code));

    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      const selected = available[randomIndex];

      // 更新今日已看列表
      shownIds.push(selected.id_code);
      wx.setStorageSync('shownIds', shownIds);

      // 更新今日点击次数
      let clicks = wx.getStorageSync('dailyClicks') || 0;
      wx.setStorageSync('dailyClicks', clicks + 1);

      this.setData({
        currentTreasure: selected,
        showBox: true
      }); 
    } else {
      // 理论上如果卡片够多不会走到这一步，但加上防错
      wx.showToast({ title: '暂时没有新耳语啦', icon: 'none' });
      this.closeBox();
    }
  },

  closeBox: function() {
    this.setData({ showBox: false, isBoxOpen: false, tourStep: 0 });
  },

  preventBubble: function() {}
});