<template>
  <div class="container">
    <draggable v-model="dataTwo" :options="dragOptions" element="ul" class="block">
      <transition-group name="transition" class="li-wrap">
        <li class="item" v-for="item in dataTwo" :key="item.time">{{item.title}}</li>
      </transition-group>
    </draggable>
    <draggable v-model="dataOne" :options="dragOptions" element="ul" class="block">
      <transition-group name="transition" class="li-wrap">
        <li class="item" v-for="item in dataOne" :key="item.time">{{item.title}}</li>
      </transition-group>
    </draggable>
    
    <draggable v-model="dataThree" :options="dragOptions" element="ul" class="block">
      <transition-group name="transition" class="li-wrap">
        <li class="item" v-for="item in dataThree" :key="item.time">{{item.title}}</li>
      </transition-group>
    </draggable>
    <draggable v-model="dataFour" :options="dragOptions" element="ul" class="block">
      <transition-group name="transition" class="li-wrap">
        <li class="item" v-for="item in dataFour" :key="item.time">{{item.title}}</li>
      </transition-group>
    </draggable>
    <draggable v-model="data" :options="dragOptions" element="ul" class="handle">
      <transition-group  name="transition" id="recovery" class="recovery">
        <div @click="dialogVisible =!dialogVisible" key=1></div>
      </transition-group>
    </draggable>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <el-rate
          :max="4"
          v-model="type"
          :texts="['不重要不紧急','不重要紧急', '重要不紧急','重要紧急']"
          show-text>
        </el-rate>
        <el-input style="margin-top:15px;" v-model="title" placeholder="大可爱的计划"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPlan">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { setPlan, getPlan } from "./../apis/local";
export default {
  name: "HelloWorld",
  components: {
    draggable
  },
  data() {
    return {
      dialogVisible: false,
      type: null,
      title: "",
      data: [],
      dataOne: getPlan("one"),
      dataTwo: getPlan("two"),
      dataThree: getPlan("three"),
      dataFour: getPlan("four")
    };
  },
  created() {},
  computed: {
    dragOptions() {
      return {
        group: "description",
        disabled: false
      };
    }
  },
  watch: {
    dataOne: function() {
      setPlan("one", this.dataOne);
    },
    dataTwo: function() {
      setPlan("two", this.dataTwo);
    },
    dataThree: function() {
      setPlan("three", this.dataThree);
    },
    dataFour: function() {
      setPlan("four", this.dataFour);
    }
  },
  methods: {
    addPlan() {
      if(!this.title){
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  color: #ffffff;
  font-size: 18px;
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
    padding: 5px 15px;
    background: #2c3e50;
    margin: 10px;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .li-wrap {
      display: inline-block;
      width: 100%;
      min-height: 40px;
      li {
        line-height: 40px;
        cursor: move;
      }
      .transition-move {
        transition: transform 0.5s;
      }
    }
  }
}
</style>
