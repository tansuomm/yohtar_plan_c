<template>
  <div class="main">
    <div class="header">
      <h1>Big lovable, this is your notebook.</h1>
    </div>
    <div class="container">
      <draggable v-model="dataTwo" :options="dragOptions" element="ul" :class="['block','illustration',dataTwo.length > 0  ? ''  : 't2',dialogVisible && type ==3 ? 'active' : '']">
        <transition-group name="transition" class="li-wrap">
          <li class="item" v-for="item in dataTwo" :key="item.time">{{item.title}}
            <el-tooltip effect="dark" :content="item.title" placement="left">
              <span class="time">{{item.time | getDay}}</span>
            </el-tooltip>
          </li>
        </transition-group>
      </draggable>
      <draggable v-model="dataOne" :options="dragOptions" element="ul" :class="['block','illustration',dataOne.length > 0  ? ''  : 't1',dialogVisible && type ==4 ? 'active' : '']">
        <transition-group name="transition" class="li-wrap">
          <li class="item" v-for="item in dataOne" :key="item.time">{{item.title}}
            <el-tooltip effect="dark" :content="item.title" placement="left">
              <span class="time">{{item.time | getDay}}</span>
            </el-tooltip>
          </li>
        </transition-group>
      </draggable>
      <draggable v-model="dataThree" :options="dragOptions" element="ul" :class="['block','illustration',dataThree.length > 0  ? ''  : 't3',dialogVisible && type ==2 ? 'active' : '']">
        <transition-group name="transition" class="li-wrap">
          <li class="item" v-for="item in dataThree" :key="item.time">{{item.title}}
            <el-tooltip effect="dark" :content="item.title" placement="left">
              <span class="time">{{item.time | getDay}}</span>
            </el-tooltip>
          </li>
        </transition-group>
      </draggable>
      <draggable v-model="dataFour" :options="dragOptions" element="ul" :class="['block','illustration',dataFour.length > 0  ? ''  : 't4',dialogVisible && type ==1? 'active' : '']">
        <transition-group name="transition" class="li-wrap">
          <li class="item" v-for="item in dataFour" :key="item.time">{{item.title}}
            <el-tooltip effect="dark" :content="item.title" placement="left">
              <span class="time">{{item.time | getDay}}</span>
            </el-tooltip>
          </li>
        </transition-group>
      </draggable>
      <draggable v-model="data" :options="dragOptions" element="ul" class="handle">
        <transition-group name="transition" id="recovery" class="recovery">
          <div @click="type=0;title='';dialogVisible = true" key=1></div>
        </transition-group>
      </draggable>
    </div>
    <el-dialog
      title="Add Plan"
      :visible.sync="dialogVisible">
      <el-rate
        style="text-align: center"
        :max="4"
        :colors="['#21D4FD', '#C469E0', '#5449CA']"
        @change="handleTip"
        v-model="type">
      </el-rate>
      <el-input ref="title" :readonly="!type" style="margin-top:15px;" v-model="title" :placeholder="tip"></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPlan">确 定</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
  import draggable from "vuedraggable";
  import {setPlan, getPlan} from "./../apis/local";

  export default {
    name: "HelloWorld",
    components: {
      draggable
    },
    data() {
      return {
        dialogVisible: false,
        type: null,
        tip:'大可爱的今日计划',
        title: "",
        data: [],
        dataOne: getPlan("one"),
        dataTwo: getPlan("two"),
        dataThree: getPlan("three"),
        dataFour: getPlan("four")
      };
    },
    created() {
    },
    computed: {
      dragOptions() {
        return {
          group: "description",
          disabled: false
        };
      }
    },
    watch: {
      type:function(val){
        if(!val){
          this.tip = '大可爱的今日计划';
        }
      },
      dataOne: function () {
        setPlan("one", this.dataOne);
      },
      dataTwo: function () {
        setPlan("two", this.dataTwo);
      },
      dataThree: function () {
        setPlan("three", this.dataThree);
      },
      dataFour: function () {
        setPlan("four", this.dataFour);
      }
    },
    methods: {
      addPlan() {
        if (!this.title) {
          return;
        }
        let obj = {
          title: this.title,
          time: new Date().getTime()
        };
        if (this.type == 4) {
          this.dataOne.push(obj);
          setPlan("one", this.dataOne);
        } else if (this.type == 3) {
          this.dataTwo.push(obj);
          setPlan("two", this.dataTwo);
        } else if (this.type == 2) {
          this.dataThree.push(obj);
          setPlan("three", this.dataThree);
        } else if (this.type == 1) {
          this.dataFour.push(obj);
          setPlan("four", this.dataFour);
        }
        this.dialogVisible = false;
      },
      handleTip(val){
        if(val ==4){
          this.tip = '重要+紧急的事';
        }else if(val ==3){
          this.tip = '重要+不紧急的事';
        }else if(val ==2){
          this.tip = '不重要+紧急的事';
        }else if(val ==1){
          this.tip = '不重要+不紧急的事';
        }else{
          this.tip = '大可爱的今日计划';
        }
        // this.$refs.title.focus();
      }
    },
    filters:{
      getDay:function (str) {
        var nowTime = new Date().getTime();
        var dateTime  = str;
        var time = nowTime - dateTime;
        var days=Math.floor(time/(24*3600*1000));
        var strTime = (days==0 ? '今天' : (days + '天前'))
        return strTime;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .main {
    width: 80%;
    height: 100%;
    padding: 10px;
    margin: 0 auto;
    .header{
      height: 80px;
      line-height: 80px;
      padding-left: 10px;
      color: #ffffff;
      h1{
        margin: 0;
      }
    }
    .container {
      position: relative;
      width: 100%;
      height: calc(100% - 80px);
      font-size: 16px;
      display: grid;
      grid-template-columns: repeat(auto-fit, 50%);
      grid-template-rows: repeat(4, 50%);
      .handle {
        position: absolute;
        width: 80px;
        height: 80px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: #ffffff;
        .recovery {
          cursor: pointer;
          position: absolute;
          background-image: url("./../assets/svg/recovery.svg");
          width: 100%;
          height: 100%;
          &:hover {
            background-image: url("./../assets/svg/add.svg");
          }
          li {
            display: none;
          }
          div {
            height: 80%;
          }
        }
      }
      .block {
        padding: 5px 20px 5px 15px;
        background: #ffffff;
        margin: 10px;
        border-radius: 10px;
        overflow: scroll;
        &:hover{
          box-shadow: inset 0 1px 6px 0px #66b1ff;
        }
        &::-webkit-scrollbar {
          display: none;
        }
        .li-wrap {
          display: inline-block;
          width: 100%;
          min-height: 40px;
          li {
            position: relative;
            line-height: 40px;
            padding-right: 40px;
            cursor: move;
            border-bottom: 1px solid #ecf5ff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:before{
              content: '';
              display: inline-block;
              width: 8px;
              height: 8px;
              margin-right: 5px;
              border-radius: 50%;
              border: 1px solid #2ba3ff;
            }
            &:hover{
              font-weight: 400;
            }
            .time{
              position: absolute;
              right: 0;
              font-size: 12px;
              line-height: 45px;
              color: #a781ff;
            }
          }
          .transition-move {
            transition: transform 0.5s;
          }
        }
      }
      .illustration{
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center;
        &.t1{
          background-image: url("./../assets/t1.png");
        }
        &.t2{
          background-image: url("./../assets/t2.png");
        }
        &.t3{
          background-image: url("./../assets/t3.png");
        }
        &.t4{
          background-image: url("./../assets/t4.png");
        }
      }
      .active{
        animation: ripple .3s ease-in-out;
      }
    }
  }
  @media only screen and (max-width: 768px) {
    .main{
      width: 100%;
      .header{
        h1{
          font-size: 1.6em;
        }
      }
    }

  }
  @keyframes ripple {
    0% {
      opacity: 1;
    }
    50%{
      opacity: 1;
      transform:scale(.8);
    }
    100% {
      opacity: 1;
      transform:scale(1);
    }
  }
</style>
