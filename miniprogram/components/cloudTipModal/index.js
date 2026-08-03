// index.js
Page({
  data: {
    allTreasures: [],
    currentTreasure: null,
    showBox: false,
    isBoxOpen: false,
    isBoxShaking: false,
    isFlashing: false, 
    
    // 闭合状态：猫趴在宝箱上的合并图
    boxClosedUrl: 'cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/开屏图_透明底.png',
    // 开启状态：开启的宝箱图
    boxOpenUrl: 'cloud://cloud1-d5gf098vz407502b3.636c-cloud1-d5gf098vz407502b3-1418310788/百宝箱-打开-浅色底.png',
  },

  onLoad: function() {
    const db = wx.cloud.database(); 
    db.collection('fantuan_treasures').get({
      success: res => {
        this.setData({ allTreasures: res.data }); 
      }
    });
  },

  handleOpenSequence: function() {
    if (this.data.isBoxOpen || this.data.isFlashing) return; 

    this.setData({ 
      isFlashing: true,
      isBoxShaking: true 
    }); 

    if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' });

    setTimeout(() => {
      this.setData({
        isBoxOpen: true,
        isFlashing: false,
        isBoxShaking: false
      });
    }, 200);

    setTimeout(() => {
      const list = this.data.allTreasures;
      if (list && list.length > 0) {
        const randomIndex = Math.floor(Math.random() * list.length);
        this.setData({
          currentTreasure: list[randomIndex],
          showBox: true
        }); 
      }
    }, 800);
  },

  closeBox: function() {
    this.setData({
      showBox: false,
      isBoxOpen: false,
      isFlashing: false,
      isBoxShaking: false
    });
  },

  preventBubble: function() {}
});
