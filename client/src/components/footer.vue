<!-- footer -->
<template>
  <div class="component-footer">
    <!-- 交通信息、开馆时间、友情链接 切换显示 -->
    <el-tabs tab-position="left" style="height: 300px;">
      <el-tab-pane label="交通信息">
        <!-- 交通信息 -->
        <ul class="tab-content-item">
          <li>
            <p class="item-details">
              <span class="left-title">地址：</span>上海市淮海中路1555号
            </p>
          </li>
          <li>
            <p class="item-details">
              <span class="left-title">邮编：</span>200031
            </p>
          </li>
          <li>
            <p class="item-details">
              <span class="left-title">电话：</span>021-64455555*2000或5000
            </p>
          </li>
          <li>
            <p class="item-details">
              <span class="left-title">传真：</span>021-64455001
            </p>
          </li>
          <li>
            <p class="item-details">
              <span class="left-title">公交：</span
              >26、911、926、945、920、830、96、93、15、548等高安路；地铁十号线上海图书馆站、地铁一号线衡山路站
            </p>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="开馆时间">
        <!-- 开馆时间 -->
        <div>
          <ul class="tab-content-item">
            <li>周一至周日 &nbsp; 8:30--20:30</li>
            <li>国家法定假日 &nbsp; 9:00--16:00</li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="关于我们">
        <!-- 关于我们 -->
        <div class="tab-content-item">
          <p>
            芜湖市镜湖区图书馆是由芜湖市镜湖区人民政府于2012年正式建成并投入使用的公共文化服务设施，馆舍面积达5200平方米，共有藏书12万余册，期刊300余种、纸质报纸60余种、典藏图书2000余册，涉及人文社科、自然科学、古典文献、少儿读物、教辅资料、地方志等多个领域，年接待量近20万人次，在2013年全国公共图书馆评估检查中被评为一级图书馆。
          </p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "siteFooter",
  data() {
    return {
      tabActive: 0
    };
  },
  methods: {
  }
};
</script>
<style scoped>
.component-footer {
  width: 100%;
  font-size: 16px;
  line-height: 25px;
}
.component-footer .tab-content-item{
  padding:8px;
}
.component-footer .tab-content-item li{
  padding:8px;
}
.component-footer .tab-content-item {
  line-height: 32px;
}
</style>
