<template>
<div class="news flex-align-center flex-column-direction">
  <div class="news-header flex-center flex-align-center flex-column-direction"></div>
  <div class="news-content semibold-text">
    <ul class="flex-align-center news-tabs-title">
      <li 
        v-for="(item, index) in newsTitle" 
        :key="item.dictSort" 
        @click="handleChangeTab(index, item.dictValue)" 
        :class="index == activeIndex ? active :'news-tabs-item'">
        {{item.dictLabel}} <i class="el-icon-arrow-right arrow-icon"></i>
      </li>
    </ul>
    <div class="news-box flex-align-center flex-wrap">
      <div class="news-item" v-for="(news, index) in newsList" :key="index">
        <a :href="news.weixinUrl" target="_blank" rel="noopener noreferrer">
          <el-skeleton :loading="loading" animated class="news-el-skeleton">
            <template slot="template">
              <el-skeleton-item variant="image" class="news-item-box" />
            </template>
            <template>
              <div class="news-item-box">
                <div class="news-item-img">
                  <img :src="news.imgIcon" alt="" />
                  <div class="news-img-mark"> 
                    <p class="news-img-mark-text">
                      {{ match(news.type) }}
                    </p>
                  </div>
                </div>
                <div class="news-item-content">
                  <div class="news-item-title">{{news.title}}</div>
                  <p class="news-item-time">{{news.createdAt}}</p>
                </div>
              </div>
            </template>
          </el-skeleton>
        </a>
      </div>
    </div>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" background :page-size="queryParams.pageSize" layout="prev, pager, next" :total=total v-show="total>0" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :current-page.sync="queryParams.pageNum">
      </el-pagination>
    </div>
  </div>
</div>
</template>

<script>
import api from '../../assets/js/api';
import utils from '../../assets/js/util';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      loading: false,
      total: 0,
      activeIndex: 0,
      active: 'active-item news-tabs-item',
      newsTitle: [],
      newsList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 6,
        type: '', // 全部
        title: "",
      }
    }
  },
  computed: {
    ...mapGetters(["screenWidth"]),
  },
  created() {
    this.getNewsType();
    this.handleChangeTab(this.activeIndex, "")
  },
  methods: {
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getNewsList();
    },
    handleChangeTab(index, dictValue) {
      this.activeIndex = index;
      this.queryParams.pageNum = 1;
      this.queryParams.type = dictValue;
      this.getNewsList();
    },
    // 获取新闻类型
    getNewsType() {
      try {
        this.loading = true
        api.getNewsType()
          .then((res) => {
            this.loading = false
            this.newsTitle = [{
              dictSort: -1,
              dictValue: "",
              dictLabel: "全部"
            }, ...res];
          })
      } catch (err) {
        console.log(err);
        this.loading = false
      }
    },
    // 获取新闻列表
    getNewsList() {
      try {
        if (this.screenWidth) {
          if (this.screenWidth >= 1310) {
            this.queryParams.pageSize = 12;
          } else if (this.screenWidth >= 860) {
            this.queryParams.pageSize = 8;
          } else {
            this.queryParams.pageSize = 6;
          }
        }
        this.loading = true
        api.getNewsList(this.queryParams)
          .then((res) => {
            this.loading = false
            if (res) {
              if (res.list) {
                res.list.forEach(item => {
                  item.createdAt = utils.formatDate(item.createdAt, 'yyyy-mm-dd h:m:s');
                });
                this.newsList = res.list;
              }
              this.total = res.total
            }
          })
      } catch (err) {
        console.log(err);
        this.loading = false
      }
    },
    // 判断新闻的type内容
    match (val) {
      let text = "";
      this.newsTitle.map((item) => {
        if (item.dictValue == val) {
          text = item.dictLabel
        }
      })
      return text;
    }
  },
}
</script>
